import { z } from 'zod';

export const iRacingCarClassSchema = z.object({
  /** The unique identifier for the car class */
  car_class_id: z.number(),
  /** List of cars that belong to this class */
  cars_in_class: z.array(
    z.object({
      /** The directory path for the car assets */
      car_dirpath: z.string(),
      /** The unique identifier for the car */
      car_id: z.number(),
      /** Whether rain is enabled for this car */
      rain_enabled: z.boolean(),
      /** Whether the car is retired */
      retired: z.boolean()
    })
  ),
  /** Customer ID (0 for official iRacing car classes) */
  cust_id: z.number(),
  /** The full name of the car class */
  name: z.string(),
  /** Whether rain is enabled for this car class */
  rain_enabled: z.boolean(),
  /** The relative speed rating of the car class */
  relative_speed: z.number(),
  /** The abbreviated name of the car class */
  short_name: z.string()
});

/**
 * Type representing an iRacing car class data structure
 * Inferred from the Zod schema
 */
export type iRacingCarClass = z.infer<typeof iRacingCarClassSchema>;
