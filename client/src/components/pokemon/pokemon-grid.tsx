import { type Pokemon } from "@shared/schema";
import PokemonCard from "./pokemon-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface PokemonGridProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPokemonSelect?: (pokemon: Pokemon) => void;
  selectedPokemonIds?: (number | undefined)[];
  lastPokemonRef?: (node: HTMLDivElement) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function PokemonGrid({ 
  pokemon, 
  isLoading,
  currentPage,
  onPageChange,
  onPokemonSelect,
  selectedPokemonIds = [],
  lastPokemonRef,
  hasMore = false,
  isLoadingMore = false
}: PokemonGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {pokemon.map((p, index) => {
          // Add a ref to the last item for infinite scrolling
          if (pokemon.length === index + 1 && lastPokemonRef) {
            return (
              <div 
                key={p.id} 
                ref={lastPokemonRef}
              >
                <PokemonCard 
                  pokemon={p}
                  onSelect={onPokemonSelect}
                  isSelected={selectedPokemonIds.includes(p.id)}
                />
              </div>
            );
          } else {
            return (
              <PokemonCard 
                key={p.id} 
                pokemon={p}
                onSelect={onPokemonSelect}
                isSelected={selectedPokemonIds.includes(p.id)}
              />
            );
          }
        })}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Lade weitere Pokémon...</span>
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <div className="text-center text-gray-500 py-6">
          Keine weiteren Pokémon verfügbar
        </div>
      )}
    </div>
  );
}