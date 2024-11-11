"use client";

import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import React, { useState } from "react";

const ProductDetails = () => {
    const router = useRouter();
    const { productId } = useParams();
    const product = products.find((p) => p._id.toString() === productId);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-lg text-gray-600">
                    Loading product details...
                </div>
            </div>
        );
    }

    const handleCheckout = () => {
        setIsProcessing(true);
        // You can add any pre-checkout logic here
        // For example, storing selected product in localStorage or state management
        localStorage.setItem('checkoutProduct', JSON.stringify(product));

        // Redirect to checkout page after a short delay to show processing state
        setTimeout(() => {
            router.push(`/checkout?productId=${productId}`);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <div className="sticky top-0 bg-white shadow-sm z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full mr-2"
                        onClick={() => window.history.back()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-medium">Product Details</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="relative aspect-square">
                                <img
                                    src={product.searchImage}
                                    alt={product.productName}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.productName}
                            </h1>
                            <p className="mt-2 text-xl font-semibold text-gray-900">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Product Description</h3>
                                <p className="text-gray-600">
                                    Experience premium quality and style with this carefully crafted product.
                                    Perfect for those who appreciate attention to detail and superior craftsmanship.
                                </p>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Rating</p>
                                        <div className="flex items-center">
                                            <span className="font-medium">4.5</span>
                                            <div className="flex text-yellow-400 ml-1">
                                                {'★'.repeat(4)}{'☆'.repeat(1)}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Availability</p>
                                        <p className="font-medium text-green-600">In Stock</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-green-600"
                                        >
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                        <p className="text-sm text-gray-600">Fast Delivery in 2-4 business days</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600"
                                        >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <p className="text-sm text-gray-600">Free shipping available</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t lg:relative lg:border-0 lg:p-0 lg:bg-transparent">
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium 
                                    transition-all duration-200 flex items-center justify-center gap-2
                                    ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                        Proceed to Checkout - ${product.price.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;