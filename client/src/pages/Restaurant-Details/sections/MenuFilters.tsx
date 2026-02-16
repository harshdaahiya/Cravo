import React from 'react';

import Icon from '../../../components/ui/Icon';

interface MenuFiltersProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({ activeFilter, setActiveFilter }) => {
    const allCategories = ['All', 'Bestseller', 'Veg', 'Non-Veg'];
    return (
        <div className="bg-bg-subtle sticky top-0 z-20 -mt-2 pt-1">
            <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto rounded-3xl bg-white p-4 shadow-sm">
                {allCategories.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`flex min-w-[100px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out ${activeFilter === filter
                                ? 'bg-primary text-text-main shadow-md'
                                : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {filter === 'All' && 'All Items'}
                        {filter === 'Bestseller' && (
                            <div className="flex items-center">
                                <Icon name="star" className="mr-1 h-4 w-4 fill-current" />{' '}
                                Bestsellers
                            </div>
                        )}
                        {filter === 'Veg' && (
                            <div className="flex items-center">
                                <Icon name="salad" className="mr-1 h-4 w-4" /> Veg
                            </div>
                        )}
                        {filter === 'Non-Veg' && (
                            <div className="flex items-center">
                                <Icon name="pizza" className="mr-1 h-4 w-4" /> Non-Veg
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuFilters;
