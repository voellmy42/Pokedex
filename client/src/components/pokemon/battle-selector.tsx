import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { type Pokemon } from "@shared/schema";
import { simulateBattle } from "@/lib/battle";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kampfergebnis</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              {battleResult && (
                <>
                  <div className="text-center">
                    <span className="text-xl font-bold text-primary">
                      {battleResult.winner.germanName}
                    </span>
                    <p>ist der Gewinner!</p>
                  </div>
                  {battleResult.typeAdvantage && (
                    <p className="text-sm text-muted-foreground">
                      Typ-Vorteil war entscheidend für den Sieg!
                    </p>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Schließen</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
