import { FC } from 'react';
import ProductCard from './ProductCard';

interface ProductSectionProps {
    products: Product[] | undefined;
}

const ProductSection: FC<ProductSectionProps> = ({ products }) => {
    const topProducts = products
        ?.sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Top Rated Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {topProducts?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductSection;
