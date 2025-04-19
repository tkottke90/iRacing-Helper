/**
 * Interface representing an iRacing car data structure
 * Generated from the iRacing API response
 */
export interface iRacingCar {
  /** Whether AI racing is enabled for this car */
  ai_enabled: boolean;
  /** Whether custom number colors are allowed for this car */
  allow_number_colors: boolean;
  /** Whether custom number fonts are allowed for this car */
  allow_number_font: boolean;
  /** Whether primary sponsor customization is allowed */
  allow_sponsor1: boolean;
  /** Whether secondary sponsor customization is allowed */
  allow_sponsor2: boolean;
  /** Whether wheel color customization is allowed */
  allow_wheel_color: boolean;
  /** Whether the car is exempt from awards */
  award_exempt: boolean;
  /** The directory path for the car assets */
  car_dirpath: string;
  /** The unique ID of the car */
  car_id: number;
  /** The full name of the car */
  car_name: string;
  /** The abbreviated name of the car */
  car_name_abbreviated: string;
  /** The types of racing categories this car belongs to */
  car_types: {
    /** The type of car (e.g., "openwheel", "road") */
    car_type: string;
  }[];
  /** The weight of the car in pounds */
  car_weight: number;
  /** Categories the car belongs to */
  categories: string[];
  /** The date when the car was created */
  created: string;
  /** The date when the car was first available for purchase */
  first_sale: string;
  /** URL to the car's forum */
  forum_url: string;
  /** Whether the car is free with subscription */
  free_with_subscription: boolean;
  /** Whether the car has headlights */
  has_headlights: boolean;
  /** Whether the car has multiple dry tire types */
  has_multiple_dry_tire_types: boolean;
  /** Whether the car has rain-capable tire types */
  has_rain_capable_tire_types: boolean;
  /** The horsepower of the car */
  hp: number;
  /** Whether the car is purchasable on PlayStation */
  is_ps_purchasable: boolean;
  /** Maximum power adjustment percentage */
  max_power_adjust_pct: number;
  /** Maximum weight penalty in kilograms */
  max_weight_penalty_kg: number;
  /** Minimum power adjustment percentage */
  min_power_adjust_pct: number;
  /** The package ID for the car */
  package_id: number;
  /** Number of livery patterns available */
  patterns: number;
  /** The price of the car */
  price: number;
  /** The display string for the price */
  price_display: string;
  /** Whether rain is enabled for this car */
  rain_enabled: boolean;
  /** Whether the car is retired */
  retired: boolean;
  /** Search filters associated with the car */
  search_filters: string;
  /** The SKU (Stock Keeping Unit) of the car */
  sku: number;
}
