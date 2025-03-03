import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pokemon suchen..."
        className="flex-1 border-2 border-[#2a9042] focus:border-[#1a6530] bg-[#d8f5d9] placeholder:text-[#1a6530]/50"
      />
      <Button 
        type="submit"
        className="bg-[#2a9042] hover:bg-[#1a6530] text-white font-semibold"
      >
        <Search className="h-4 w-4 mr-2" />
        Suchen
      </Button>
    </form>
  );
}