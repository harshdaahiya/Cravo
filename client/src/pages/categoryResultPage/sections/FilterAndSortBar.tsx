import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/ui/Icon';

interface QuickFilters {
    tenMinDelivery: boolean;
    topRated: boolean;
    offers: boolean;
}

interface SelectedFilters {
    rating: string[];
    price: string[];
    deliveryTime: string[];
    offers: string[];
    [key: string]: string[];
}

interface FilterAndSortBarProps {
    selectedSortBy: string;
    setSelectedSortBy: (sortBy: string) => void;
    quickFilters: QuickFilters;
    setQuickFilters: React.Dispatch<React.SetStateAction<QuickFilters>>;
    selectedFilters: SelectedFilters;
    setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}

const FilterAndSortBar: React.FC<FilterAndSortBarProps> = ({
    selectedSortBy,
    setSelectedSortBy,
    quickFilters,
    setQuickFilters,
    selectedFilters,
    setSelectedFilters,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortByOpen, setIsSortByOpen] = useState(false);

    const sortByRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // Hardcoded data for sort and filter options
    const sortOptions = [
        {
            id: 'relevance',
            label: 'Relevance',
            description: 'Best match for your search',
        },
        { id: 'rating', label: 'Rating', description: 'Highest rated first' },
        {
            id: 'deliveryTime',
            label: 'Delivery Time',
            description: 'Fastest delivery first',
        },
        {
            id: 'costLowToHigh',
            label: 'Cost: Low to High',
            description: 'Cheapest first',
        },
        {
            id: 'costHighToLow',
            label: 'Cost: High to Low',
            description: 'Most expensive first',
        },
    ];

    const filterOptions = {
        rating: [
            { id: '4.5+', label: '4.5+ Rating', count: 120 },
            { id: '4.0+', label: '4.0+ Rating', count: 250 },
            { id: '3.5+', label: '3.5+ Rating', count: 380 },
        ],
        price: [
            { id: 'under200', label: 'Under ₹200', count: 85 },
            { id: '200-400', label: '₹200 - ₹400', count: 150 },
            { id: '400-600', label: '₹400 - ₹600', count: 95 },
            { id: 'above600', label: 'Above ₹600', count: 45 },
        ],
        deliveryTime: [
            { id: 'under30', label: 'Under 30 mins', count: 180 },
            { id: '30-45', label: '30-45 mins', count: 220 },
            { id: 'above45', label: 'Above 45 mins', count: 75 },
        ],
        offers: [
            { id: 'discount', label: 'Discounts Available', count: 95 },
            { id: 'freeDelivery', label: 'Free Delivery', count: 120 },
            { id: 'buyOneGetOne', label: 'Buy 1 Get 1', count: 35 },
        ],
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortByRef.current && !sortByRef.current.contains(event.target as Node)) {
                setIsSortByOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleQuickFilter = (filterType: keyof QuickFilters) => {
        setQuickFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType],
        }));
    };

    const handleFilterChange = (category: string, filterId: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(filterId)
                ? prev[category].filter(id => id !== filterId)
                : [...prev[category], filterId],
        }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            rating: [],
            price: [],
            deliveryTime: [],
            offers: [],
        });
        setQuickFilters({
            tenMinDelivery: false,
            topRated: false,
            offers: false,
        });
    };

    const getActiveFiltersCount = () => {
        const filterCount = Object.values(selectedFilters).flat().length;
        const quickFilterCount = Object.values(quickFilters).filter(Boolean).length;
        return filterCount + quickFilterCount;
    };

    return (
        <div className="border-border mb-6 rounded-2xl border bg-white p-3 shadow-sm md:p-4">
            {/* Mobile Layout */}
            <div className="block md:hidden">
                {/* Top Row - Sort and Filter buttons */}
                <div className="mb-3 flex items-center justify-between">
                    {/* Sort By Dropdown */}
                    <div className="relative mr-2 flex-1" ref={sortByRef}>
                        <button
                            onClick={() => setIsSortByOpen(!isSortByOpen)}
                            className="text-text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200"
                        >
                            <span>Sort By</span>
                            <Icon
                                name="chevron-down"
                                size={14}
                                className={`transform transition-transform ${isSortByOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {isSortByOpen && (
                            <div className="border-border absolute top-full left-0 z-20 w-full rounded-xl border bg-white shadow-xl mt-1">
                                <div className="border-b border-gray-100 p-2">
                                    <h3 className="text-text-main text-sm font-bold">Sort By</h3>
                                </div>
                                <div className="p-1">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSelectedSortBy(option.id);
                                                setIsSortByOpen(false);
                                            }}
                                            className="hover:bg-bg-subtle flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left transition-colors"
                                        >
                                            <div>
                                                <p className="text-text-main text-xs font-medium">
                                                    {option.label}
                                                </p>
                                                <p className="text-text-secondary text-xs">
                                                    {option.description}
                                                </p>
                                            </div>
                                            {selectedSortBy === option.id && (
                                                <Icon
                                                    name="check"
                                                    size={14}
                                                    className="text-yellow-400"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative ml-2 flex-1" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="text-text-secondary flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200"
                        >
                            <Icon name="filter" size={14} />
                            <span>Filter</span>
                            {getActiveFiltersCount() > 0 && (
                                <span className="bg-primary text-text-main min-w-[18px] rounded-full px-1.5 py-0.5 text-center text-xs font-bold">
                                    {getActiveFiltersCount()}
                                </span>
                            )}
                        </button>

                        {isFilterOpen && (
                            <div
                                className="border-border absolute top-full right-0 z-20 mt-2 w-80 rounded-xl border bg-white shadow-lg"
                                style={{ maxWidth: '90vw' }}
                            >
                                <div className="flex items-center justify-between border-b border-gray-100 p-3">
                                    <h3 className="text-text-main text-sm font-bold">Filters</h3>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs font-medium text-yellow-400 hover:text-yellow-500"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="max-h-72 overflow-y-auto">
                                    {Object.entries(filterOptions).map(([category, options]) => (
                                        <div
                                            key={category}
                                            className="border-b border-gray-100 p-3 last:border-b-0"
                                        >
                                            <h4 className="text-text-main mb-1 text-sm font-semibold capitalize">
                                                {category === 'deliveryTime'
                                                    ? 'Delivery Time'
                                                    : category}
                                            </h4>
                                            <div className="">
                                                {options.map(option => (
                                                    <label
                                                        key={option.id}
                                                        className="hover:bg-bg-subtle flex cursor-pointer items-center justify-between rounded-lg p-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFilters[category].includes(
                                                                    option.id
                                                                )}
                                                                onChange={() =>
                                                                    handleFilterChange(category, option.id)
                                                                }
                                                                className="h-3 w-3 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                                                            />
                                                            <span className="text-text-secondary text-sm">
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-text-muted text-xs">
                                                            ({option.count})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 p-3">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="bg-primary hover:bg-primary-hover text-text-main w-full rounded-lg py-2 text-sm font-semibold transition-colors duration-200"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row - Quick Filter buttons (scrollable) */}
                <div className="overflow-x-auto">
                    <div
                        className="flex space-x-2 pb-1"
                        style={{ minWidth: 'max-content' }}
                    >
                        <button
                            onClick={() => handleQuickFilter('tenMinDelivery')}
                            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${quickFilters.tenMinDelivery
                                    ? 'bg-primary text-text-main'
                                    : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            <Icon name="zap" size={14} />
                            <span>10 Min</span>
                        </button>

                        <button
                            onClick={() => handleQuickFilter('topRated')}
                            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${quickFilters.topRated
                                    ? 'bg-primary text-text-main'
                                    : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            <Icon name="award" size={14} />
                            <span>Top Rated</span>
                        </button>

                        <button
                            onClick={() => handleQuickFilter('offers')}
                            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${quickFilters.offers
                                    ? 'bg-primary text-text-main'
                                    : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            <Icon name="trending-up" size={14} />
                            <span>Offers</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Layout (md and above) */}
            <div className="hidden flex-wrap items-center gap-3 md:flex">
                {/* Quick Filter Buttons */}
                <button
                    onClick={() => handleQuickFilter('tenMinDelivery')}
                    className={`flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${quickFilters.tenMinDelivery
                            ? 'bg-primary text-text-main'
                            : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="zap" size={16} />
                    <span>10 Min Delivery</span>
                </button>

                <button
                    onClick={() => handleQuickFilter('topRated')}
                    className={`flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${quickFilters.topRated
                            ? 'bg-primary text-text-main'
                            : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="award" size={16} />
                    <span>Top Rated</span>
                </button>

                <button
                    onClick={() => handleQuickFilter('offers')}
                    className={`flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${quickFilters.offers
                            ? 'bg-primary text-text-main'
                            : 'text-text-secondary bg-gray-100 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="trending-up" size={16} />
                    <span>Offers</span>
                </button>

                <div className="flex-1"></div>

                {/* Sort By Dropdown */}
                <div className="relative" ref={sortByRef}>
                    <button
                        onClick={() => setIsSortByOpen(!isSortByOpen)}
                        className="text-text-secondary flex cursor-pointer items-center space-x-2 rounded-xl bg-gray-100 px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-200"
                    >
                        <span>Sort By</span>
                        <Icon
                            name="chevron-down"
                            size={16}
                            className={`transform transition-transform ${isSortByOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {isSortByOpen && (
                        <div className="border-border absolute top-full right-0 z-20 mt-2 w-80 rounded-2xl border bg-white shadow-lg">
                            <div className="border-b border-gray-100 p-4">
                                <h3 className="text-text-main font-bold">Sort By</h3>
                            </div>
                            <div className="p-2">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSelectedSortBy(option.id);
                                            setIsSortByOpen(false);
                                        }}
                                        className="hover:bg-bg-subtle flex w-full cursor-pointer items-center justify-between rounded-xl p-3 transition-colors"
                                    >
                                        <div className="text-left">
                                            <p className="text-text-main font-medium">
                                                {option.label}
                                            </p>
                                            <p className="text-text-secondary text-sm">
                                                {option.description}
                                            </p>
                                        </div>
                                        {selectedSortBy === option.id && (
                                            <Icon
                                                name="check"
                                                size={16}
                                                className="text-yellow-400"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="text-text-secondary flex cursor-pointer items-center space-x-2 rounded-xl bg-gray-100 px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-200"
                    >
                        <Icon name="filter" size={16} />
                        <span>Filter</span>
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-primary text-text-main rounded-full px-2 py-1 text-xs font-bold">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>

                    {isFilterOpen && (
                        <div className="border-border absolute top-full right-0 z-20 mt-2 w-96 rounded-2xl border bg-white shadow-lg">
                            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                                <h3 className="text-text-main font-bold">Filters</h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm font-medium text-yellow-400 hover:text-yellow-500"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {Object.entries(filterOptions).map(([category, options]) => (
                                    <div
                                        key={category}
                                        className="border-b border-gray-100 p-4 last:border-b-0"
                                    >
                                        <h4 className="text-text-main mb-3 font-semibold capitalize">
                                            {category === 'deliveryTime' ? 'Delivery Time' : category}
                                        </h4>
                                        <div className="space-y-2">
                                            {options.map(option => (
                                                <label
                                                    key={option.id}
                                                    className="hover:bg-bg-subtle flex cursor-pointer items-center justify-between rounded-lg p-2"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[category].includes(
                                                                option.id
                                                            )}
                                                            onChange={() =>
                                                                handleFilterChange(category, option.id)
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                                                        />
                                                        <span className="text-text-secondary">
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-text-muted text-sm">
                                                        ({option.count})
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 p-4">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="bg-primary hover:bg-primary-hover text-text-main w-full rounded-xl py-3 font-semibold transition-colors duration-200"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterAndSortBar;
