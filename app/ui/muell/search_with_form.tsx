"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const SearchKey = "query";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData);
    const search = formData.get("search") as string;
    if (search) {
      params.set(SearchKey, search);
    } else {
      params.delete(SearchKey);
    }
    replace(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <form className="w-full" onSubmit={(e) => handleSearch(e)}>
        <input
          name="search"
          defaultValue={searchParams.get(SearchKey)?.toString()}
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
        />
      </form>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
