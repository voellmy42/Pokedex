import { type Pokemon } from "@shared/schema";

// German translations for Pokémon types are in pokemon.ts

// Type effectiveness chart
export const typeEffectiveness: Record<string, Record<string, number>> = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5
  }
};

// Calculate type effectiveness multiplier
function calculateTypeEffectiveness(attackerType: string, defenderTypes: string[]): number {
  let multiplier = 1;
  defenderTypes.forEach(defenderType => {
    multiplier *= typeEffectiveness[attackerType]?.[defenderType] ?? 1;
  });
  return multiplier;
}

// Calculate total stats
function calculateTotalStats(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.value, 0);
}

// Calculate battle power considering type advantages
function calculateBattlePower(attacker: Pokemon, defender: Pokemon): number {
  const totalStats = calculateTotalStats(attacker);
  let typeAdvantage = 1;

  attacker.types.forEach(type => {
    typeAdvantage *= calculateTypeEffectiveness(type, defender.types);
  });

  return totalStats * typeAdvantage;
}

interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  winnerPower: number;
  loserPower: number;
  typeAdvantage: boolean;
}

export function simulateBattle(pokemon1: Pokemon, pokemon2: Pokemon): BattleResult {
  const power1 = calculateBattlePower(pokemon1, pokemon2);
  const power2 = calculateBattlePower(pokemon2, pokemon1);

  if (power1 >= power2) {
    return {
      winner: pokemon1,
      loser: pokemon2,
      winnerPower: power1,
      loserPower: power2,
      typeAdvantage: power1 > calculateTotalStats(pokemon1)
    };
  } else {
    return {
      winner: pokemon2,
      loser: pokemon1,
      winnerPower: power2,
      loserPower: power1,
      typeAdvantage: power2 > calculateTotalStats(pokemon2)
    };
  }
}