import { Container, Inject, Injectable } from '@decorators/di';
import {
  CommonProperties,
  CreateTrack,
  CreateTrackConfig,
  createTrackSchema,
  Track,
  TrackConfig,
  trackConfigSchema
} from '../dto/track.dto';
import { Database, QueryOptions } from '../interfaces/database';
import {
  iRacingTrack,
  iRacingTrackConfigSchema
} from '../interfaces/track.iracing';
import { LoggerService } from '../services';
import { prettyPrintSnakeCase } from '../utilities/string.utils';
import { QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import { iRacingPropertiesDao } from './iracing-properties.dao';

@Injectable()
export class TrackDao {
  private readonly nodeLabel = 'Track';

  constructor(
    @Inject('Database')
    private readonly database: Database,

    @Inject('LoggerService')
    private readonly logger: LoggerService,

    @Inject('iRacingPropertiesDao')
    private readonly iRacingPropertiesDao: iRacingPropertiesDao
  ) {}

  async createFromIRacing(track: iRacingTrack) {
    // Validate the iRacing Track Data
    const parsedInput = iRacingTrackConfigSchema.safeParse(track);

    if (!parsedInput.success) {
      throw new Error(parsedInput.error.message);
    }

    return await this.database.transaction(async (transaction) => {
      const parsedTrack = createTrackSchema.parse(parsedInput.data);

      const trackRecord = await this.upsertTrack(
        parsedInput.data.sku,
        parsedTrack,
        { transaction }
      );

      const configuration = trackConfigSchema.parse({
        ...parsedInput.data,
        id: parsedInput.data.track_id,
        name: parsedInput.data.config_name,
        length: parsedInput.data.track_config_length,
        short_parade_lap: parsedInput.data.has_short_parade_lap
      });

      await this.upsertTrackConfig(track.track_id, configuration, {
        transaction
      });

      const createConfigRelationship = await this.database.join(
        'CONFIG_OF',
        track.track_id,
        track.sku,
        'from',
        { transaction }
      );

      if (!createConfigRelationship) {
        throw new Error(
          'Failed to create relationship between track and config'
        );
      }

      await this.iRacingPropertiesDao.bulkUpsertAndAttach(
        CommonProperties.map((property) => ({
          name: prettyPrintSnakeCase(property),
          type: property
        })),
        { label: this.nodeLabel, id: trackRecord.id },
        transaction
      );

      this.logger.log('debug', 'Created Track', {
        track: trackRecord.track_name
      });

      return trackRecord;
    });
  }

  async upsertTrack(id: number, data: CreateTrack, options?: any) {
    return await this.database.upsert<Track>(
      'Track',
      id,
      { ...data, id },
      options
    );
  }

  async upsertTrackConfig(
    id: number,
    data: CreateTrackConfig,
    options?: QueryOptions<unknown, unknown>
  ) {
    return await this.database.upsert<TrackConfig>(
      'TrackConfig',
      id,
      { ...data, id },
      options
    );
  }

  /**
   * Get all tracks from the database
   * @returns Promise resolving to an array of tracks
   */
  async getAllTracks(): Promise<Track[]> {
    try {
      const result = await this.database.execute<QueryResult>(
        'MATCH (t:Track) RETURN t',
        {}
      );

      // Extract track properties from the Neo4j result
      return result.records.map(
        (record: Neo4jRecord) => record.get('t').properties as Track
      );
    } catch (error) {
      this.logger.error(
        error as Error,
        'Failed to retrieve tracks from database'
      );
      return [];
    }
  }

  /**
   * Get a track by ID
   * @param id The track ID
   * @returns Promise resolving to a track or null if not found
   */
  async getTrackById(id: number): Promise<Track | null> {
    try {
      const result = await this.database.execute<QueryResult>(
        'MATCH (t:Track {id: $id}) RETURN t',
        { id }
      );

      if (result.records.length === 0) {
        return null;
      }

      return (result.records[0] as Neo4jRecord).get('t').properties as Track;
    } catch (error) {
      this.logger.error(
        error as Error,
        `Failed to retrieve track with ID ${id} from database`
      );
      return null;
    }
  }

  // async getTracksByType() {}

  // toTrackDTO(track: Track): TrackDTO {
  //   return {
  //     id: track.id,
  //     name: track.track_name,
  //     price: track.price,
  //     price_display: track.price_display,
  //     free_with_subscription: track.free_with_subscription,
  //     pit_road_speed_limit: track.pit_road_speed_limit

  //   };
  // }
}

Container.provide([{ provide: 'TrackDao', useClass: TrackDao }]);
