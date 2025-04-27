import { z } from 'zod';

/**
 * Zod schema for validating iRacing car data
 */
export const iRacingCarSchema = z.object({
  /** Whether AI racing is enabled for this car */
  ai_enabled: z.boolean(),
  /** Whether custom number colors are allowed for this car */
  allow_number_colors: z.boolean(),
  /** Whether custom number fonts are allowed for this car */
  allow_number_font: z.boolean(),
  /** Whether primary sponsor customization is allowed */
  allow_sponsor1: z.boolean(),
  /** Whether secondary sponsor customization is allowed */
  allow_sponsor2: z.boolean(),
  /** Whether wheel color customization is allowed */
  allow_wheel_color: z.boolean(),
  /** Whether the car is exempt from awards */
  award_exempt: z.boolean(),
  /** The directory path for the car assets */
  car_dirpath: z.string(),
  /** The unique ID of the car */
  car_id: z.number().int().positive(),
  /** The full name of the car */
  car_name: z.string(),
  /** The abbreviated name of the car */
  car_name_abbreviated: z.string(),
  /** The types of racing categories this car belongs to */
  car_types: z.array(
    z.object({
      /** The type of car (e.g., "openwheel", "road") */
      car_type: z.string()
    })
  ),
  /** The weight of the car in pounds */
  car_weight: z.number().positive(),
  /** Categories the car belongs to */
  categories: z.array(z.string()),
  /** The date when the car was created */
  created: z.string().datetime(),
  /** The date when the car was first available for purchase */
  first_sale: z.string().datetime(),
  /** URL to the car's forum */
  forum_url: z.string().url(),
  /** Whether the car is free with subscription */
  free_with_subscription: z.boolean(),
  /** Whether the car has headlights */
  has_headlights: z.boolean(),
  /** Whether the car has multiple dry tire types */
  has_multiple_dry_tire_types: z.boolean(),
  /** Whether the car has rain-capable tire types */
  has_rain_capable_tire_types: z.boolean(),
  /** The horsepower of the car */
  hp: z.number().positive(),
  /** Whether the car is purchasable on PlayStation */
  is_ps_purchasable: z.boolean(),
  /** Maximum power adjustment percentage */
  max_power_adjust_pct: z.number(),
  /** Maximum weight penalty in kilograms */
  max_weight_penalty_kg: z.number().nonnegative(),
  /** Minimum power adjustment percentage */
  min_power_adjust_pct: z.number(),
  /** The package ID for the car */
  package_id: z.number().int().positive(),
  /** Number of livery patterns available */
  patterns: z.number().int().nonnegative(),
  /** The price of the car */
  price: z.number().nonnegative(),
  /** The display string for the price */
  price_display: z.string(),
  /** Whether rain is enabled for this car */
  rain_enabled: z.boolean(),
  /** Whether the car is retired */
  retired: z.boolean(),
  /** Search filters associated with the car */
  search_filters: z.string(),
  /** The SKU (Stock Keeping Unit) of the car */
  sku: z.number().int().positive()
});

/**
 * Type representing an iRacing car data structure
 * Inferred from the Zod schema
 */
export type iRacingCar = z.infer<typeof iRacingCarSchema>;

export const Car {}

export const CarType {}