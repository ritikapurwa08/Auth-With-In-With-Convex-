import { Id } from "../../../../convex/_generated/dataModel";

export interface SnippetFile {
  fileName: string;
  fileType: string;
  fileCode: string;
}

export type SearchedSnippetType = {
  _id: Id<"snippets">;
  _creationTime: number;
  projectName: string;
  projectFiles: SnippetFile[];
  userId: Id<"users">;
  projectImage?: string;
};

// hooks/useSnippetsSearch.ts
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useCallback } from "react";

export const useSnippetsSearch = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 300); // Reduced debounce time

  const searchResults = useQuery(api.snippets.getSnippetsBySearch, {
    search: debouncedSearch,
  });

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  return {
    searchText,
    searchResults: searchResults || [],
    handleSearch,
    isSearching: !!debouncedSearch,
  };
};

// hooks/useDebounce.ts

// components/SearchComponent.tsx
import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/features/global/use-debounce";

interface SearchComponentProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchComponent = memo(
  ({ value, onChange, className = "" }: SearchComponentProps) => {
    return (
      <div className={`relative ${className}`}>
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          className="pl-10 w-full"
          placeholder="Search all snippets..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }
);

SearchComponent.displayName = "SearchComponent";

export default SearchComponent;
