"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const products = useQuery(api.products.get);
  console.log(products);
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* {products?.map(({ _id, productName }) => <div key={_id}>{productName}</div>)} */}
      {products
        ?.sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
        .map(({ _id, productName }) => (
          <div key={_id}>{productName}</div>
        ))}
    </div>
  );
}
