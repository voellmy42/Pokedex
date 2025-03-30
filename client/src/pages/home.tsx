import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PokemonGrid from "@/components/pokemon/pokemon-grid";
import SearchBar from "@/components/pokemon/search-bar";
import BattleSelector from "@/components/pokemon/battle-selector";
import TypeChart from "@/components/pokemon/type-chart";
import { Card, CardContent } from "@/components/ui/card";
import { type Pokemon } from "@shared/schema";

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<(Pokemon | null)[]>([null, null]);

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["/api/pokemon", page, search],
    queryFn: () =>
      fetch(`/api/pokemon?page=${page}&query=${search}`).then((res) => res.json()),
  });

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(current => {
      if (current.some(p => p?.id === pokemon.id)) {
        return current;
      }

      const index = current.findIndex(p => p === null);
      if (index === -1) {
        return current;
      }

      const newSelected = [...current];
      newSelected[index] = pokemon;
      return newSelected;
    });
  };

  const handlePokemonDeselect = (index: number) => {
    setSelectedPokemon(current => {
      const newSelected = [...current];
      newSelected[index] = null;
      return newSelected;
    });
  };

  return (
    <div className="min-h-screen bg-[#e61515]">
      <div className="container mx-auto px-4 py-8">
        <Card className="rounded-3xl border-4 border-[#1a1a1a] shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Top section with lights */}
            <div className="bg-[#1a1a1a] p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3298cb] border-4 border-white shadow-inner flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#85bdfe] animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <div className="w-4 h-4 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Main content */}
            <div className="p-4 sm:p-6 bg-white">
              <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Pokédex
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Willkommen beim modernisierten Pokédex
                </p>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 sm:p-4 mb-4 sticky top-0 z-10">
                <SearchBar onSearch={setSearch} />
              </div>

              <div className="space-y-4">
                <TypeChart />

                <BattleSelector
                  selectedPokemon={selectedPokemon}
                  onSelectPokemon={handlePokemonSelect}
                />

                <PokemonGrid
                  pokemon={pokemon || []}
                  isLoading={isLoading}
                  currentPage={page}
                  onPageChange={setPage}
                  onSelect={handlePokemonSelect}
                  selectedPokemon={selectedPokemon}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}