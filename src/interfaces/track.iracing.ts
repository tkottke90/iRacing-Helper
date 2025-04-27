import { z } from 'zod';

/**
 * Zod schema for validating iRacing track data
 */
export const iRacingTrackConfigSchema = z.object({
  /** Whether AI racing is enabled on this track */
  ai_enabled: z.boolean(),
  /** Whether collisions in the pit lane are allowed */
  allow_pitlane_collisions: z.boolean(),
  /** Whether rolling starts are allowed on this track */
  allow_rolling_start: z.boolean(),
  /** Whether standing starts are allowed on this track */
  allow_standing_start: z.boolean(),
  /** Whether the track is exempt from awards */
  award_exempt: z.boolean(),
  /** The category of the track (e.g., "road", "oval") */
  category: z.string(),
  /** The ID of the track category */
  category_id: z.number().int(),
  /** The date when the track closes or is removed from service */
  closes: z.string(),
  /** The name of the track configuration */
  config_name: z.string(),
  /** The number of corners per lap */
  corners_per_lap: z.number().int().nonnegative(),
  /** The date when the track was created */
  created: z.string().datetime(),
  /** The date when the track was first available for purchase */
  first_sale: z.string().datetime(),
  /** Whether the track is free with subscription */
  free_with_subscription: z.boolean(),
  /** Whether the track is fully lit for night racing */
  fully_lit: z.boolean(),
  /** The number of grid stalls available */
  grid_stalls: z.number().int().nonnegative(),
  /** Whether the track has an optional path */
  has_opt_path: z.boolean(),
  /** Whether the track has a short parade lap */
  has_short_parade_lap: z.boolean(),
  /** Whether the track has a start zone */
  has_start_zone: z.boolean(),
  /** Whether the track has an SVG map */
  has_svg_map: z.boolean(),
  /** Whether the track is a dirt track */
  is_dirt: z.boolean(),
  /** Whether the track is an oval */
  is_oval: z.boolean(),
  /** Whether the track is purchasable on PlayStation */
  is_ps_purchasable: z.boolean(),
  /** The lap scoring method (0 for standard) */
  lap_scoring: z.number().int().nonnegative(),
  /** The latitude coordinate of the track */
  latitude: z.number(),
  /** The location of the track */
  location: z.string(),
  /** The longitude coordinate of the track */
  longitude: z.number(),
  /** The maximum number of cars allowed on the track */
  max_cars: z.number().int().positive(),
  /** Whether the track has night lighting */
  night_lighting: z.boolean(),
  /** The number of pit stalls available */
  number_pitstalls: z.number().int().nonnegative(),
  /** The date when the track opens or becomes available */
  opens: z.string(),
  /** The package ID for the track */
  package_id: z.number().int().positive(),
  /** The pit road speed limit in mph/kph */
  pit_road_speed_limit: z.number().positive(),
  /** The price of the track */
  price: z.number().nonnegative(),
  /** The display string for the price */
  price_display: z.string(),
  /** The priority of the track (for sorting) */
  priority: z.number().int(),
  /** Whether the track is available for purchase */
  purchasable: z.boolean(),
  /** The number of laps required for qualification */
  qualify_laps: z.number().int().nonnegative(),
  /** Whether rain is enabled on this track */
  rain_enabled: z.boolean(),
  /** Whether restarts are on the left side */
  restart_on_left: z.boolean(),
  /** Whether the track is retired */
  retired: z.boolean(),
  /** Search filters associated with the track */
  search_filters: z.string(),
  /** The URL of the track's website */
  site_url: z.string().url(),
  /** The SKU (Stock Keeping Unit) of the track */
  sku: z.number().int().positive(),
  /** The number of laps for solo racing */
  solo_laps: z.number().int().nonnegative(),
  /** Whether starts are on the left side */
  start_on_left: z.boolean(),
  /** Whether the track supports grip compound selection */
  supports_grip_compound: z.boolean(),
  /** Whether the track is a technical track */
  tech_track: z.boolean(),
  /** The time zone of the track location */
  time_zone: z.string(),
  /** The length of the track configuration in miles/km */
  track_config_length: z.number().positive(),
  /** The directory path for the track assets */
  track_dirpath: z.string(),
  /** The unique ID of the track */
  track_id: z.number().int().positive(),
  /** The name of the track */
  track_name: z.string(),
  /** The types of racing supported on this track */
  track_types: z.array(
    z.object({
      /** The type of track (e.g., "road", "oval", "dirt") */
      track_type: z.string()
    })
  )
});

/**
 * Type representing an iRacing track data structure
 * Inferred from the Zod schema
 */
export type iRacingTrack = z.infer<typeof iRacingTrackConfigSchema>;
