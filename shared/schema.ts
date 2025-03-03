import { z } from "zod";

export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  types: z.array(z.string()),
  height: z.number(),
  weight: z.number(),
  stats: z.array(z.object({
    name: z.string(),
    value: z.number()
  })),
  sprites: z.object({
    front_default: z.string()
  }),
  germanName: z.string(),
  germanDescription: z.string()
});

export type Pokemon = z.infer<typeof pokemonSchema>;

export const searchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.number().optional()
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
