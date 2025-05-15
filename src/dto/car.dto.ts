import { z } from 'zod';
import { iRacingCar, iRacingCarSchema } from '../interfaces/car.iracing';
import { createSchemas } from '../utilities/schema.utils';

/**
 * Array of common car properties that can be used with Zod's enum
 * The 'as const' assertion is crucial for Zod to infer the correct literal types
 */
export const CommonProperties = [
  'ai_enabled',
  'rain_enabled',
  'retired'
] as const satisfies readonly (keyof iRacingCar)[];

/**
 * Type representing the allowed property names from CommonProperties
 */
export type CarPropertyDTO = (typeof CommonProperties)[number];

export const { schema: carSchema, createSchema: createCarSchema } =
  createSchemas(
    iRacingCarSchema.pick({
      car_name: true,
      car_id: true,
      price: true,
      has_headlights: true,
      price_display: true,
      free_with_subscription: true
    })
  );

export type CreateCarDTO = z.infer<typeof createCarSchema>;
export type CarDTO = z.infer<typeof carSchema>;

const carWithPropertiesSchema = carSchema.extend({
  properties: z.array(
    z.object({
      type: z.enum(CommonProperties),
      name: z.string()
    })
  )
});

export type CarWithPropertiesDTO = z.infer<typeof carWithPropertiesSchema>;
