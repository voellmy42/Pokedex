import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import axios from "axios";

const GERMAN_LANGUAGE_ID = 6;

async function getGermanTranslation(pokemonId: number) {
  const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  const names = speciesResponse.data.names;
  const descriptions = speciesResponse.data.flavor_text_entries;

  const germanName = names.find((n: any) => n.language.name === "de")?.name || "";
  const germanDesc = descriptions.find((d: any) => d.language.name === "de")?.flavor_text || "";

  return { germanName, germanDescription: germanDesc };
}

export async function registerRoutes(app: Express) {
  app.get("/api/pokemon", async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const query = req.query.query as string | undefined;

    try {
      // If cache is empty, fetch initial data
      if (storage.getPokemonList(1).then(list => list.length === 0)) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        
        for (const item of response.data.results) {
          const pokemonResponse = await axios.get(item.url);
          const { germanName, germanDescription } = await getGermanTranslation(pokemonResponse.data.id);

          const pokemon = {
            id: pokemonResponse.data.id,
            name: pokemonResponse.data.name,
            types: pokemonResponse.data.types.map((t: any) => t.type.name),
            height: pokemonResponse.data.height,
            weight: pokemonResponse.data.weight,
            stats: pokemonResponse.data.stats.map((s: any) => ({
              name: s.stat.name,
              value: s.base_stat
            })),
            sprites: {
              front_default: pokemonResponse.data.sprites.front_default
            },
            germanName,
            germanDescription
          };

          storage.cachePokemon(pokemon);
        }
      }

      const pokemon = await storage.getPokemonList(page, query);
      res.json(pokemon);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Pokemon" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
