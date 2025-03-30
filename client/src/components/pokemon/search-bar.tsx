
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const { data: pokemon } = useQuery({
    queryKey: ["allPokemon"],
    queryFn: async () => {
      let allPokemon = [];
      let page = 1;
      while (true) {
        const response = await fetch(`/api/pokemon?page=${page}`);
        const data = await response.json();
        if (data.length === 0) break;
        allPokemon = [...allPokemon, ...data];
        page++;
      }
      return allPokemon;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setOpen(false);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    onSearch(name);
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Pokemon suchen..."
              className="border-2 border-gray-300 focus:border-primary/50"
              onFocus={() => setOpen(true)}
            />
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full" align="start">
            <Command>
              <CommandInput placeholder="Pokemon suchen..." value={value} onValueChange={setValue} />
              <CommandEmpty>Keine Pokemon gefunden</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {pokemon?.map((p: any) => (
                  <CommandItem
                    key={p.id}
                    value={p.germanName}
                    onSelect={handleSelect}
                    className="flex items-center gap-2"
                  >
                    <img src={p.sprites.front_default} alt={p.name} className="w-8 h-8" />
                    <span>{p.germanName}</span>
                    <span className="text-muted-foreground">({p.name})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        type="submit"
        className="bg-primary hover:bg-primary/90 text-white font-semibold"
      >
        <Search className="h-4 w-4 mr-2" />
        Suchen
      </Button>
    </form>
  );
}
