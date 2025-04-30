import { z } from 'zod';

export function createSchemas<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return {
    schema: schema.extend({ id: z.number() }),
    createSchema: schema
  };
}

export type EntitySchema<T extends z.ZodRawShape> = {
  schema: z.ZodObject<T & { id: z.ZodNumber }>;
  createSchema: z.ZodObject<T>;
};
