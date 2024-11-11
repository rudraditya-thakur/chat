"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
    _id: string;
    productName: string;
    price: number;
    searchImage: string;
    brand?: string;
    category?: string;
}

interface ShippingDetails {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

const CheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    useEffect(() => {
        // Retrieve product data from localStorage
        const storedProduct = localStorage.getItem('checkoutProduct');
        if (storedProduct) {
            setProduct(JSON.parse(storedProduct));
        } else {
            // Redirect back if no product found
            router.push('/');
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Clear checkout data
            localStorage.removeItem('checkoutProduct');

            // Redirect to success page
            router.push('/checkout/success');
        } catch (error) {
            console.error('Checkout error:', error);
            setIsLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" >
                <div className="animate-pulse text-lg text-gray-600" >
                    Loading checkout...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12" >
            <div className="max-w-7xl mx-auto px-4" >
                {/* Header */}
                <div className="max-w-2xl mx-auto mb-8" >
                    <h1 className="text-3xl font-bold text-gray-900 text-center" > Checkout </h1>
                </div>

                < div className="max-w-4xl mx-auto" >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8" >
                        {/* Order Summary */}
                        < div className="bg-white p-6 rounded-lg shadow-sm" >
                            <h2 className="text-lg font-semibold mb-4" > Order Summary </h2>
                            < div className="flex items-center gap-4 mb-4" >
                                <div className="w-20 h-20 relative rounded-md overflow-hidden" >
                                    <img
                                        src={product.searchImage}
                                        alt={product.productName}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                < div >
                                    <h3 className="font-medium" > {product.productName} </h3>
                                    <p className="text-gray-600" > {product.brand} </p>
                                </div>
                            </div>

                            < div className="border-t pt-4 space-y-2" >
                                <div className="flex justify-between" >
                                    <span className="text-gray-600" > Subtotal </span>
                                    <span > ${product.price.toFixed(2)} </span>
                                </div>
                                < div className="flex justify-between" >
                                    <span className="text-gray-600" > Shipping </span>
                                    <span className="text-green-600" > Free </span>
                                </div>
                                < div className="flex justify-between border-t pt-2" >
                                    <span className="font-semibold" > Total </span>
                                    <span className="font-semibold" > ${product.price.toFixed(2)} </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Form */}
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm" >
                            <h2 className="text-lg font-semibold mb-4" > Shipping Details </h2>
                            < div className="space-y-4" >
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1" >
                                        Full Name
                                    </label>
                                    < input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        required
                                        value={shippingDetails.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" >
                                        Email
                                    </label>
                                    < input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={shippingDetails.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div >
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" >
                                        Address
                                    </label>
                                    < input
                                        type="text"
                                        id="address"
                                        name="address"
                                        required
                                        value={shippingDetails.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                < div className="grid grid-cols-2 gap-4" >
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1" >
                                            City
                                        </label>
                                        < input
                                            type="text"
                                            id="city"
                                            name="city"
                                            required
                                            value={shippingDetails.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div >
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1" >
                                            State
                                        </label>
                                        < input
                                            type="text"
                                            id="state"
                                            name="state"
                                            required
                                            value={shippingDetails.state}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                < div className="grid grid-cols-2 gap-4" >
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1" >
                                            ZIP Code
                                        </label>
                                        < input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={shippingDetails.zipCode}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1" >
                                            Country
                                        </label>
                                        < input
                                            type="text"
                                            id="country"
                                            name="country"
                                            required
                                            value={shippingDetails.country}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium 
                                    transition-all duration-200 flex items-center justify-center gap-2
                                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {
                                    isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" > </circle>
                                                < path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" > </path>
                                            </svg>
                                            Processing Order...
                                        </>
                                    ) : (
                                        <>Complete Order - ${product.price.toFixed(2)} </>
                                    )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;