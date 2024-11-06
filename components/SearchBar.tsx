"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("name") as string;

    if (query) {
      router.push(`/products?query=${query}`)

      // Store query in local storage
      const existingQueries = JSON.parse(localStorage.getItem("searchQueries") || "[]");
      existingQueries.push(query);
      localStorage.setItem("searchQueries", JSON.stringify(existingQueries));
    }
  };

  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="name"
        placeholder="Search for products..."
        className="flex-1 bg-transparent outline-none"
      />
      <button type="submit" className="cursor-pointer">
        <Image src="/search.png" alt="Search" width={16} height={16} />
      </button>
    </form>
  );
};

export default SearchBar;
