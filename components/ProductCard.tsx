import React from "react";
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { productName, price, rating, ratingCount, searchImage, landingPageUrl } = product;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <a href={`https://myntra.com/${landingPageUrl}`} className="block">
                <div className="relative aspect-square">
                    <img
                        src={searchImage || "/api/placeholder/300/300"}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">{productName}</h3>
                    <p className="text-xl font-bold text-gray-900 mb-2">
                        &#8377;{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={index}
                                    size={16}
                                    className={`${index < Math.floor(rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300 fill-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">({ratingCount})</span>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default ProductCard;