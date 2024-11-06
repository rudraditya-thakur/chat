import { FC, useEffect, useState } from 'react';

interface Product {
    _id: number;
    productName: string;
    price: number;
    rating: number;
    ratingCount: number;
    searchImage: string;
    landingPageUrl: string;
}
interface ProductCardProps {
    product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="border p-4 rounded-md shadow hover:shadow-lg">
            <img src={product.searchImage} alt={product.productName} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
            <p className="text-gray-700 mt-1">Price: ${product.price.toFixed(2)}</p>
            <p className="text-yellow-500 mt-1">Rating: {product.rating} ★</p>
            <a
                href={`https://myntra.com/${product.landingPageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
            >
                View Product
            </a>
        </div>
    );
};

interface SuggestedProductSectionProps {
    products: Product[] | undefined;
}

const SuggestedProductSection: FC<SuggestedProductSectionProps> = ({ products }) => {
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const searchQueries = JSON.parse(localStorage.getItem("searchQueries") || "[]");

        if (products && searchQueries.length > 0) {
            const recommendations = products
                .map((product) => {
                    const relevanceScore = searchQueries.reduce((score: number, query: string) => {
                        const matchCount = (product.productName.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length;
                        return score + matchCount;
                    }, 0);
                    return { product, relevanceScore };
                })
                .filter(({ relevanceScore }) => relevanceScore > 0)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, 10)
                .map(({ product }) => product);

            setRecommendedProducts(recommendations);
        } else {
            setRecommendedProducts(products?.slice(0, 10) || []);
        }
    }, [products]);

    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="font-bold text-3xl mb-2">Suggested for you</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recommendedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default SuggestedProductSection;
