// "use client";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import Slider from "@/components/Slider";
import SuggestedProductSection from "@/components/SuggestedProductSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import { products } from "@/data/products";

export default function Home() {
  console.log(products);
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Slider />
      <WhyChooseUs />
      <SuggestedProductSection products={products} />
    </div>
  );
}
