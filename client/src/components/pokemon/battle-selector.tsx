import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Swords, Flame, Droplets, Leaf, Zap, Snowflake, CircleDot, 
  Skull, Mountain, Wind, Brain, Bug, Ghost, Infinity, 
  Moon, Shield, Sparkles, Circle 
} from "lucide-react";
import { type Pokemon } from "@shared/schema";
import { simulateBattle } from "@/lib/battle";
import { typeTranslations, getTypeBackgroundClass, getTypeTextClass, getTypeIcon } from "@/lib/pokemon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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

interface BattleSelectorProps {
  selectedPokemon: (Pokemon | null)[];
  onSelectPokemon: (index: number, pokemon: Pokemon | null) => void;
}

export default function BattleSelector({ selectedPokemon, onSelectPokemon }: BattleSelectorProps) {
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<ReturnType<typeof simulateBattle> | null>(null);

  const handleBattle = () => {
    if (selectedPokemon[0] && selectedPokemon[1]) {
      const result = simulateBattle(selectedPokemon[0], selectedPokemon[1]);
      setBattleResult(result);
      setShowResult(true);
    }
  };

  return (
    <div className="mb-8 bg-gray-100 rounded-xl p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Kampfarena</h2>
      <div className="flex items-center justify-center gap-4">
        <PokemonSlot
          pokemon={selectedPokemon[0]}
          onClear={() => onSelectPokemon(0, null)}
        />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-primary mb-2">VS</span>
          <Button
            onClick={handleBattle}
            disabled={!selectedPokemon[0] || !selectedPokemon[1]}
            className="bg-primary hover:bg-primary/90"
          >
            <Swords className="w-4 h-4 mr-2" />
            Kampf!
          </Button>
        </div>
        <PokemonSlot
          pokemon={selectedPokemon[1]}
          onClear={() => onSelectPokemon(1, null)}
        />
      </div>

      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl mb-4">
              Kampfergebnis
            </AlertDialogTitle>
            {battleResult && (
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <PokemonStats 
                    pokemon={battleResult.winner} 
                    power={battleResult.winnerPower}
                    isWinner={true}
                  />
                  <div className="text-2xl font-bold text-primary self-center">VS</div>
                  <PokemonStats 
                    pokemon={battleResult.loser} 
                    power={battleResult.loserPower}
                    isWinner={false}
                  />
                </div>

                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold mb-2">Kampfanalyse:</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-primary">{battleResult.winner.germanName}</span> hat den Kampf gewonnen!
                    </p>
                    {battleResult.typeAdvantage && (
                      <p className="text-emerald-600">
                        Typ-Vorteil war entscheidend für den Sieg! Die Typen von {battleResult.winner.germanName} waren 
                        besonders effektiv gegen {battleResult.loser.germanName}.
                      </p>
                    )}
                    <p>
                      Kampfkraft: {battleResult.winnerPower.toFixed(0)} vs {battleResult.loserPower.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Schließen</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PokemonStats({ pokemon, power, isWinner }: { pokemon: Pokemon, power: number, isWinner: boolean }) {
  return (
    <div className={`flex-1 p-4 rounded-lg ${isWinner ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-gray-50'}`}>
      <div className="text-center">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.germanName}
          className="w-32 h-32 mx-auto"
        />
        <h3 className="font-bold text-lg mb-2">{pokemon.germanName}</h3>
        <div className="flex gap-2 justify-center mb-4">
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
      </div>
      <div className="space-y-2">
        {pokemon.stats.map((stat) => (
          <div key={stat.name} className="text-sm">
            <div className="flex justify-between mb-1">
              <span>{typeTranslations[stat.name] || stat.name}</span>
              <span>{stat.value}</span>
            </div>
            <Progress value={stat.value} max={255} className="h-1" />
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="font-semibold">Kampfkraft: {power.toFixed(0)}</span>
      </div>
    </div>
  );
}

function PokemonSlot({ pokemon, onClear }: { pokemon: Pokemon | null, onClear: () => void }) {
  if (!pokemon) {
    return (
      <Card className="w-40 h-40 flex items-center justify-center border-2 border-dashed">
        <CardContent className="text-center text-muted-foreground">
          Wähle ein Pokemon
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-40 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 rounded-full"
        onClick={onClear}
      >
        ×
      </Button>
      <CardContent className="text-center p-4">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.germanName}
          className="w-24 h-24 mx-auto"
        />
        <p className="font-medium truncate">{pokemon.germanName}</p>
      </CardContent>
    </Card>
  );
}