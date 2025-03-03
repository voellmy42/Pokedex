import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Pokemon } from "@shared/schema";
import { useLocation } from "wouter";
import { typeTranslations, getTypeBackgroundClass, getTypeTextClass } from "@/lib/pokemon";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
  isSelected?: boolean;
}

export default function PokemonCard({ pokemon, onSelect, isSelected }: PokemonCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    if (onSelect) {
      onSelect(pokemon);
    } else {
      setLocation(`/pokemon/${pokemon.id}`);
    }
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-shadow cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleClick}
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
      </CardContent>
    </Card>
  );
}