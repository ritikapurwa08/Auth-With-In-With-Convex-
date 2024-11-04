import { Input } from "@/components/ui/input";
import { useDebounce } from "@/features/global/use-debounce";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedValue) {
      router.push(`/snippets/?search=${debouncedValue}`);
    } else if (!debouncedValue && pathname === "/discover")
      router.push("/discover");
  }, [router, pathname, debouncedValue]);

  return (
    <div className="relative flex flex-grow ">
      <Input
        className="w-full min-w-full pl-10"
        placeholder="Search for podcasts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
      <SearchIcon className="absolute size-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2 " />
    </div>
  );
};

export default Searchbar;
