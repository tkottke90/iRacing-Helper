{
  "ai_enabled": false,
  "allow_pitlane_collisions": true,
  "allow_rolling_start": true,
  "allow_standing_start": true,
  "award_exempt": true,
  "category": "road",
  "category_id": 2,
  "closes": "2022-10-31",
  "config_name": "[Retired] Full Course",
  "corners_per_lap": 20,
  "created": "2006-05-28T04:20:00Z",
  "first_sale": "2008-08-26T00:00:00Z",
  "free_with_subscription": true,
  "fully_lit": false,
  "grid_stalls": 62,
  "has_opt_path": false,
  "has_short_parade_lap": false,
  "has_start_zone": false,
  "has_svg_map": true,
  "is_dirt": false,
  "is_oval": false,
  "is_ps_purchasable": true,
  "lap_scoring": 0,
  "latitude": 36.560008,
  "location": "Alton, Virginia, USA",
  "longitude": -79.2048,
  "max_cars": 72,
  "night_lighting": false,
  "number_pitstalls": 37,
  "opens": "2022-03-01",
  "package_id": 14,
  "pit_road_speed_limit": 45,
  "price": 0,
  "price_display": "$0.00",
  "priority": 0,
  "purchasable": true,
  "qualify_laps": 2,
  "rain_enabled": true,
  "restart_on_left": false,
  "retired": true,
  "search_filters": "road",
  "site_url": "http://www.virclub.com/vir",
  "sku": 10031,
  "solo_laps": 4,
  "start_on_left": false,
  "supports_grip_compound": false,
  "tech_track": false,
  "time_zone": "America/New_York",
  "track_config_length": 3.27,
  "track_dirpath": "virginia\\full",
  "track_id": 2,
  "track_name": "[Retired] Virginia International Raceway",
  "track_types": [
    {
      "track_type": "road"
    }
  ]
}

/**
 * Interface representing an iRacing track data structure
 * Generated from the iRacing API response
 */
export interface iRacingTrack {
  /** Whether AI racing is enabled on this track */
  ai_enabled: boolean;
  /** Whether collisions in the pit lane are allowed */
  allow_pitlane_collisions: boolean;
  /** Whether rolling starts are allowed on this track */
  allow_rolling_start: boolean;
  /** Whether standing starts are allowed on this track */
  allow_standing_start: boolean;
  /** Whether the track is exempt from awards */
  award_exempt: boolean;
  /** The category of the track (e.g., "road", "oval") */
  category: string;
  /** The ID of the track category */
  category_id: number;
  /** The date when the track closes or is removed from service */
  closes: string;
  /** The name of the track configuration */
  config_name: string;
  /** The number of corners per lap */
  corners_per_lap: number;
  /** The date when the track was created */
  created: string;
  /** The date when the track was first available for purchase */
  first_sale: string;
  /** Whether the track is free with subscription */
  free_with_subscription: boolean;
  /** Whether the track is fully lit for night racing */
  fully_lit: boolean;
  /** The number of grid stalls available */
  grid_stalls: number;
  /** Whether the track has an optional path */
  has_opt_path: boolean;
  /** Whether the track has a short parade lap */
  has_short_parade_lap: boolean;
  /** Whether the track has a start zone */
  has_start_zone: boolean;
  /** Whether the track has an SVG map */
  has_svg_map: boolean;
  /** Whether the track is a dirt track */
  is_dirt: boolean;
  /** Whether the track is an oval */
  is_oval: boolean;
  /** Whether the track is purchasable on PlayStation */
  is_ps_purchasable: boolean;
  /** The lap scoring method (0 for standard) */
  lap_scoring: number;
  /** The latitude coordinate of the track */
  latitude: number;
  /** The location of the track */
  location: string;
  /** The longitude coordinate of the track */
  longitude: number;
  /** The maximum number of cars allowed on the track */
  max_cars: number;
  /** Whether the track has night lighting */
  night_lighting: boolean;
  /** The number of pit stalls available */
  number_pitstalls: number;
  /** The date when the track opens or becomes available */
  opens: string;
  /** The package ID for the track */
  package_id: number;
  /** The pit road speed limit in mph/kph */
  pit_road_speed_limit: number;
  /** The price of the track */
  price: number;
  /** The display string for the price */
  price_display: string;
  /** The priority of the track (for sorting) */
  priority: number;
  /** Whether the track is available for purchase */
  purchasable: boolean;
  /** The number of laps required for qualification */
  qualify_laps: number;
  /** Whether rain is enabled on this track */
  rain_enabled: boolean;
  /** Whether restarts are on the left side */
  restart_on_left: boolean;
  /** Whether the track is retired */
  retired: boolean;
  /** Search filters associated with the track */
  search_filters: string;
  /** The URL of the track's website */
  site_url: string;
  /** The SKU (Stock Keeping Unit) of the track */
  sku: number;
  /** The number of laps for solo racing */
  solo_laps: number;
  /** Whether starts are on the left side */
  start_on_left: boolean;
  /** Whether the track supports grip compound selection */
  supports_grip_compound: boolean;
  /** Whether the track is a technical track */
  tech_track: boolean;
  /** The time zone of the track location */
  time_zone: string;
  /** The length of the track configuration in miles/km */
  track_config_length: number;
  /** The directory path for the track assets */
  track_dirpath: string;
  /** The unique ID of the track */
  track_id: number;
  /** The name of the track */
  track_name: string;
  /** The types of racing supported on this track */
  track_types: {
    /** The type of track (e.g., "road", "oval", "dirt") */
    track_type: string;
  }[];
}


