import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { type Pokemon } from "@shared/schema";
import { formatHeight, formatWeight, typeTranslations, statTranslations, getTypeBackgroundClass, getTypeTextClass } from "@/lib/pokemon";

export default function PokemonDetail() {
  const [, params] = useRoute("/pokemon/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");

  const { data: pokemon, isLoading } = useQuery<Pokemon>({
    queryKey: [`/api/pokemon/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="h-8 bg-primary/10 rounded w-1/3 mb-4" />
            <div className="h-64 bg-primary/10 rounded mb-4" />
            <div className="h-4 bg-primary/10 rounded w-2/3 mb-2" />
            <div className="h-4 bg-primary/10 rounded w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-red-500">Pokemon nicht gefunden</h1>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {pokemon.germanName}
              </h1>
              <span className="text-2xl text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLocation('/')}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)} text-lg px-4 py-1`}
              >
                {typeTranslations[type]}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.germanName}
              className="w-64 h-64 object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Beschreibung</h2>
            <p className="text-lg text-muted-foreground">{pokemon.germanDescription}</p>
          </div>

          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Entwicklungen</h2>
              <div className="flex gap-4 items-center justify-center">
                {pokemon.evolutions.map((evolution, index) => (
                  <div 
                    key={evolution.id}
                    className="text-center cursor-pointer"
                    onClick={() => setLocation(`/pokemon/${evolution.id}`)}
                  >
                    <img
                      src={evolution.sprite}
                      alt={evolution.germanName}
                      className="w-24 h-24"
                    />
                    <p className="font-medium">{evolution.germanName}</p>
                    {index < pokemon.evolutions.length - 1 && (
                      <div className="text-2xl text-muted-foreground mx-2">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Größe</h3>
              <p className="text-2xl">{formatHeight(pokemon.height)}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Gewicht</h3>
              <p className="text-2xl">{formatWeight(pokemon.weight)}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Statuswerte</h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{statTranslations[stat.name]}</span>
                    <span>{stat.value}</span>
                  </div>
                  <Progress value={stat.value} max={255} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}