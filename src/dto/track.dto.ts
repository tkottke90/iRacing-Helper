import { z } from 'zod';
import {
  iRacingTrack,
  iRacingTrackConfigSchema
} from '../interfaces/track.iracing';

function createSchemas<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return {
    schema: schema.extend({ id: z.number() }),
    createSchema: schema
  };
}

export const { schema: trackSchema, createSchema: createTrackSchema } =
  createSchemas(
    iRacingTrackConfigSchema.pick({
      track_name: true,
      track_id: true,
      price: true,
      price_display: true,
      free_with_subscription: true,
      pit_road_speed_limit: true
    })
  );

export type CreateTrack = z.infer<typeof createTrackSchema>;
export type Track = z.infer<typeof trackSchema>;

export const {
  schema: trackConfigSchema,
  createSchema: createTrackConfigSchema
} = createSchemas(
  z.object({
    name: z.string(),
    max_cars: z.number(),
    length: z.number(),
    short_parade_lap: z.boolean(),
    corners_per_lap: z.number()
  })
);

export type CreateTrackConfig = z.infer<typeof createTrackConfigSchema>;
export type TrackConfig = z.infer<typeof trackConfigSchema>;

/**
 * Array of common track properties that can be used with Zod's enum
 * The 'as const' assertion is crucial for Zod to infer the correct literal types
 */
export const CommonProperties = [
  'ai_enabled',
  'allow_rolling_start',
  'allow_standing_start',
  'category',
  'has_short_parade_lap',
  'fully_lit',
  'rain_enabled',
  'retired'
] as const satisfies readonly (keyof iRacingTrack)[];

/**
 * Type representing the allowed property names from CommonProperties
 */
export type TrackPropertyName = (typeof CommonProperties)[number];

/**
 * Schema for track property objects
 */
export const {
  schema: trackPropertySchema,
  createSchema: createTrackPropertySchema
} = createSchemas(
  z.object({
    type: z.enum(CommonProperties),
    name: z.string()
  })
);

/**
 * Type representing a track property
 */
export type TrackProperty = z.infer<typeof trackPropertySchema>;
export type CreateTrackProperty = z.infer<typeof createTrackPropertySchema>;
