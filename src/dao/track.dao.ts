import { Container, Inject, Injectable } from '@decorators/di';
import {
  iRacingTrack,
  iRacingTrackConfigSchema
} from '../interfaces/track.iracing';
import {
  createTrackConfigSchema,
  createTrackSchema,
  Track,
  TrackConfig,
  trackConfigSchema,
  trackPropertySchema,
  trackSchema
} from '../dto/track.dto';
import { Database } from '../interfaces/database';

@Injectable()
export class TrackDao {
  constructor(
    @Inject('Database')
    private readonly database: Database
  ) {}

  async createFromIRacing(track: iRacingTrack) {
    // Validate the iRacing Track Data
    const parsedInput = iRacingTrackConfigSchema.safeParse(track);

    if (!parsedInput.success) {
      throw new Error(parsedInput.error.message);
    }

    return await this.database.transaction(async (transaction) => {
      const parsedTrack = createTrackSchema.parse(parsedInput.data);

      const trackRecord = await this.database.upsert<Track>(
        'Track',
        parsedInput.data.sku,
        {
          ...parsedTrack,
          id: parsedInput.data.sku
        },
        { transaction }
      );

      const configuration = trackConfigSchema.parse({
        ...parsedInput.data,
        id: parsedInput.data.track_id,
        name: parsedInput.data.config_name,
        length: parsedInput.data.track_config_length,
        short_parade_lap: parsedInput.data.has_short_parade_lap
      });

      await this.database.upsert<TrackConfig>(
        'TrackConfig',
        track.track_id,
        configuration,
        { transaction }
      );

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

      return trackRecord;
    });
  }
}

Container.provide([{ provide: 'TrackDao', useClass: TrackDao }]);
