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
      fetch(`/api/pokemon?page=${page}&query=${search}`).then(res => res.json())
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Pokédex
            </h1>
            <SearchBar onSearch={setSearch} />
          </CardContent>
        </Card>

        <PokemonGrid 
          pokemon={pokemon || []} 
          isLoading={isLoading}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
