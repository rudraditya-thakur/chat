"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Slider from "@/components/Slider";
import SuggestedProductSection from "@/components/SuggestedProductSection";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  const products = useQuery(api.products.get);
  console.log(products);
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Slider />
      <WhyChooseUs />
      <SuggestedProductSection products={products} />
    </div>
  );
}
