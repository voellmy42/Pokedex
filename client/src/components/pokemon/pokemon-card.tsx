import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Pokemon } from "@shared/schema";
import { useLocation } from "wouter";
import { typeTranslations, getTypeBackgroundClass, getTypeTextClass, getTypeIcon } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { Sword, Book, Flame, Droplets, Leaf, Zap, Snowflake, CircleDot, 
  Swords, Skull, Mountain, Wind, Brain, Bug, Ghost, Infinity, Moon, Shield, Sparkles, Circle } from "lucide-react";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
  isSelected?: boolean;
}

// Helper component to display the type icon
const TypeIcon = ({ type }: { type: string }) => {
  const iconName = getTypeIcon(type);
  
  // Get the correct icon based on the name
  switch (iconName) {
    case "CircleDot": return <CircleDot className="h-4 w-4 mr-1" />;
    case "Flame": return <Flame className="h-4 w-4 mr-1" />;
    case "Droplets": return <Droplets className="h-4 w-4 mr-1" />;
    case "Leaf": return <Leaf className="h-4 w-4 mr-1" />;
    case "Zap": return <Zap className="h-4 w-4 mr-1" />;
    case "Snowflake": return <Snowflake className="h-4 w-4 mr-1" />;
    case "Swords": return <Swords className="h-4 w-4 mr-1" />;
    case "Skull": return <Skull className="h-4 w-4 mr-1" />;
    case "Mountain": return <Mountain className="h-4 w-4 mr-1" />;
    case "Wind": return <Wind className="h-4 w-4 mr-1" />;
    case "Brain": return <Brain className="h-4 w-4 mr-1" />;
    case "Bug": return <Bug className="h-4 w-4 mr-1" />;
    case "Ghost": return <Ghost className="h-4 w-4 mr-1" />;
    case "Infinity": return <Infinity className="h-4 w-4 mr-1" />;
    case "Moon": return <Moon className="h-4 w-4 mr-1" />;
    case "Shield": return <Shield className="h-4 w-4 mr-1" />;
    case "Sparkles": return <Sparkles className="h-4 w-4 mr-1" />;
    default: return <Circle className="h-4 w-4 mr-1" />;
  }
};

export default function PokemonCard({ pokemon, onSelect, isSelected }: PokemonCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow active:scale-98 touch-manipulation",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardHeader className="p-3 sm:p-4">
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
              className={`${getTypeBackgroundClass(type)} ${getTypeTextClass(type)} flex items-center`}
            >
              <TypeIcon type={type} />
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