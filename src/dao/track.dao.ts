import { Container, Inject, Injectable } from '@decorators/di';
import {
  CommonProperties,
  CreateTrack,
  CreateTrackConfig,
  createTrackSchema,
  Track,
  TrackConfig,
  trackConfigSchema,
  TrackProperty
} from '../dto/track.dto';
import { Database, QueryOptions } from '../interfaces/database';
import {
  iRacingTrack,
  iRacingTrackConfigSchema
} from '../interfaces/track.iracing';
import { prettyPrintSnakeCase } from '../utilities/string.utils';
import { LoggerService } from '../services';

@Injectable()
export class TrackDao {
  constructor(
    @Inject('Database')
    private readonly database: Database,

    @Inject('LoggerService')
    private readonly logger: LoggerService
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

      // There are a number of properties that each track has and instead
      // of making those properties of the nodes themselves, we want to
      // instead create a relationship between the track and the property
      await this.database.execute(
        [
          'UNWIND $properties AS property',
          'MERGE (p:TrackProperty {type: property.type})',
          'ON CREATE SET p = property, p.createdAt = datetime(), p.updatedAt = datetime()',
          'ON MATCH SET p += property, p.updatedAt = datetime()',
          'WITH p',
          'MATCH (t:Track {id: $track_id})',
          'MERGE (t)-[:HAS_PROPERTY]->(p)'
        ].join(' '),
        {
          track_id: trackRecord.id,
          properties: CommonProperties.map((property) => ({
            type: property,
            name: prettyPrintSnakeCase(property)
          }))
        },
        { transaction }
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

  async upsertTrackConfig(id: number, data: CreateTrackConfig, options?: any) {
    return await this.database.upsert<TrackConfig>(
      'TrackConfig',
      id,
      { ...data, id },
      options
    );
  }
}

Container.provide([{ provide: 'TrackDao', useClass: TrackDao }]);
