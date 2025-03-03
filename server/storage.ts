import { type Pokemon } from "@shared/schema";
import NodeCache from "node-cache";

export interface IStorage {
  getPokemon(id: number): Promise<Pokemon | undefined>;
  getPokemonList(page: number, query?: string): Promise<Pokemon[]>;
  cachePokemon(pokemon: Pokemon): void;
}

export class MemStorage implements IStorage {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
  }

  async getPokemon(id: number): Promise<Pokemon | undefined> {
    return this.cache.get(`pokemon:${id}`);
  }

  async getPokemonList(page: number, query?: string): Promise<Pokemon[]> {
    const allPokemon = Object.values(this.cache.mget(this.cache.keys())) as Pokemon[];
    
    let filtered = allPokemon;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = allPokemon.filter(p => 
        p.germanName.toLowerCase().includes(lowerQuery) ||
        p.name.toLowerCase().includes(lowerQuery)
      );
    }

    const perPage = 20;
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }

  cachePokemon(pokemon: Pokemon): void {
    this.cache.set(`pokemon:${pokemon.id}`, pokemon);
  }
}

export const storage = new MemStorage();
