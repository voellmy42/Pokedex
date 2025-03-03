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

async function getEvolutionChain(pokemonId: number) {
  try {
    const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
    const evolutionResponse = await axios.get(evolutionChainUrl);

    const evolutions = [];
    let evoData = evolutionResponse.data.chain;

    while (evoData) {
      if (evoData.species) {
        const speciesUrl = evoData.species.url;
        const pokemonId = parseInt(speciesUrl.split('/').slice(-2, -1)[0]);
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const { germanName } = await getGermanTranslation(pokemonId);

        evolutions.push({
          id: pokemonId,
          name: evoData.species.name,
          germanName,
          sprite: pokemonResponse.data.sprites.front_default
        });
      }

      evoData = evoData.evolves_to[0];
    }

    return evolutions;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return [];
  }
}

export async function registerRoutes(app: Express) {
  app.get("/api/pokemon", async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const query = req.query.query as string | undefined;

    try {
      // If cache is empty, fetch initial data
      if (await storage.getPokemonList(1).then(list => list.length === 0)) {
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

  app.get("/api/pokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      let pokemon = await storage.getPokemon(id);
      if (!pokemon) {
        res.status(404).json({ message: "Pokemon nicht gefunden" });
        return;
      }

      // Fetch evolution chain if not already cached
      if (!pokemon.evolutions) {
        const evolutions = await getEvolutionChain(id);
        pokemon = { ...pokemon, evolutions };
        storage.cachePokemon(pokemon);
      }

      res.json(pokemon);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden des Pokemon" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}