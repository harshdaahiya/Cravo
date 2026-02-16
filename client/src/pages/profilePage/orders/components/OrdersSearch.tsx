import React from 'react';
import { Search } from 'lucide-react';

interface OrdersSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const OrdersSearch: React.FC<OrdersSearchProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, restaurant, or item..."
                className="border-border w-full rounded-xl border bg-white py-3.5 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
        </div>
    );
};

export default OrdersSearch;
