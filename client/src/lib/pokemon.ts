// German translations for Pokémon types
export const typeTranslations: Record<string, string> = {
  normal: "Normal",
  fire: "Feuer",
  water: "Wasser",
  electric: "Elektro",
  grass: "Pflanze",
  ice: "Eis",
  fighting: "Kampf",
  poison: "Gift",
  ground: "Boden",
  flying: "Flug",
  psychic: "Psycho",
  bug: "Käfer",
  rock: "Gestein",
  ghost: "Geist",
  dragon: "Drache",
  dark: "Unlicht",
  steel: "Stahl",
  fairy: "Fee"
};

// German translations for stats
export const statTranslations: Record<string, string> = {
  hp: "KP",
  attack: "Angriff",
  defense: "Verteidigung",
  "special-attack": "Spezial-Angriff",
  "special-defense": "Spezial-Verteidigung",
  speed: "Initiative"
};

// Format height from decimeters to meters
export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)}m`;
}

// Format weight from hectograms to kilograms
export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)}kg`;
}

// Format the Pokémon ID to always have 3 digits
export function formatPokemonId(id: number): string {
  return id.toString().padStart(3, '0');
}

// Clean up German description text by removing extra whitespace and newlines
export function cleanDescription(description: string): string {
  return description
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Get background color class based on Pokémon type
export function getTypeBackgroundClass(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  return typeColors[type] || "bg-gray-400";
}

// Get text color class based on Pokémon type
export function getTypeTextClass(type: string): string {
  const darkTypes = ["electric", "ice", "fairy"];
  return darkTypes.includes(type) ? "text-gray-900" : "text-white";
}
