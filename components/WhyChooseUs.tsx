import React from 'react';
import { Truck, CreditCard, ShieldCheck, Award } from 'lucide-react';

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg transition-transform hover:scale-105">
        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Truck className="w-8 h-8 text-gray-700" />,
            title: "Free Shipping",
            description: "All purchases over 1,999 are eligible for free shipping via USPS First Class Mail."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-gray-700" />,
            title: "Easy Payments",
            description: "All payments are processed instantly over a secure payment protocol."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-gray-700" />,
            title: "Money-Back Guarantee",
            description: "If an item arrived damaged or you've changed your mind, you can send it back for a full refund."
        },
        {
            icon: <Award className="w-8 h-8 text-gray-700" />,
            title: "Finest Quality",
            description: "Designed to last, each of our products has been crafted with the finest materials."
        }
    ];

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why should you choose us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Feature
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;