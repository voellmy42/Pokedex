import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Pokemon } from "@shared/schema";
import { useLocation } from "wouter";
import { typeTranslations, getTypeBackgroundClass, getTypeTextClass } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { Sword, Book } from "lucide-react";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
  isSelected?: boolean;
}

export default function PokemonCard({ pokemon, onSelect, isSelected }: PokemonCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{pokemon.germanName}</h3>
          <span className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.germanName}
            className="w-32 h-32"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)}`}
            >
              {typeTranslations[type]}
            </Badge>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {pokemon.germanDescription}
        </p>

        {/* Action buttons that appear on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-gray-100"
              onClick={() => setLocation(`/pokemon/${pokemon.id}`)}
              title="Details anzeigen"
            >
              <Book className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-gray-100"
              onClick={() => onSelect?.(pokemon)}
              disabled={isSelected}
              title="Für Kampf auswählen"
            >
              <Sword className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}