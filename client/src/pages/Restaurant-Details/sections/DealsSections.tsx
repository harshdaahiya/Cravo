import React from 'react';

// Mock data for deals, replace with API call if needed
interface Deal {
    id: number;
    title: string;
    description: string;
}

const deals: Deal[] = [
    { id: 1, title: 'Flat 10% Off', description: 'On orders above ₹500' },
    { id: 2, title: '20% Off', description: 'Upto ₹100' },
    { id: 3, title: 'Flat ₹150 Off', description: 'On orders above ₹1000' },
    { id: 4, title: 'Free Delivery', description: 'On first order' },
];

const DealsSection: React.FC = () => {
    return (
        <div className="mb-8">
            <h2 className="text-text-main mb-4 text-2xl font-bold">Deals for You</h2>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto p-1">
                {deals.map(deal => (
                    <div
                        key={deal.id}
                        className="w-64 flex-shrink-0 rounded-2xl border border-yellow-200 bg-yellow-50 p-1.5 shadow-sm"
                    >
                        <p className="text-text-main mb-1 text-lg font-semibold">
                            {deal.title}
                        </p>
                        <p className="text-text-secondary text-sm">{deal.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsSection;
