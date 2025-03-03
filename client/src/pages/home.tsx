import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PokemonGrid from "@/components/pokemon/pokemon-grid";
import SearchBar from "@/components/pokemon/search-bar";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["/api/pokemon", page, search],
    queryFn: () =>
      fetch(`/api/pokemon?page=${page}&query=${search}`).then((res) => res.json()),
  });

  return (
    <div className="min-h-screen bg-[#CE1C24]">
      <div className="container mx-auto px-4 py-8">
        <Card className="rounded-3xl border-8 border-[#1a1a1a] shadow-2xl overflow-hidden">
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

            {/* Screen border */}
            <div className="p-8 bg-[#1a1a1a]">
              {/* Screen content */}
              <div className="bg-[#98FB98] p-6 rounded-lg shadow-inner">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-2 text-[#1a1a1a]">
                    Pokédex
                  </h1>
                  <p className="text-[#1a1a1a]/70">
                    Willkommen beim modernisierten Pokédex
                  </p>
                </div>

                <div className="bg-[#c8e6c9] rounded-xl p-4 mb-6 shadow-inner">
                  <SearchBar onSearch={setSearch} />
                </div>

                <PokemonGrid
                  pokemon={pokemon || []}
                  isLoading={isLoading}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            </div>

            {/* Bottom section with d-pad styling */}
            <div className="bg-[#1a1a1a] p-6">
              <div className="w-24 h-24 relative mx-auto">
                <div className="absolute inset-0 bg-[#333] rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#222] rounded-md"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#222] rounded-md"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#222] rounded-md"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#222] rounded-md"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}