import React, { useEffect, useRef, useState } from 'react';

import Icon from '../../../components/ui/Icon';

export interface ActiveFilters {
    fastDelivery: boolean;
    newProducts: boolean;
    rating4Plus: boolean;
    pureVeg: boolean;
    offers: boolean;
    price300to600: boolean;
    priceLess300: boolean;
}

interface FiltersAndSerachBarProps {
    isVisible?: boolean;
    onFilterChange?: (filters: ActiveFilters) => void;
    onSortChange?: (sortId: string) => void;
    onSearchChange?: (query: string) => void;
}

const FiltersAndSerachBar: React.FC<FiltersAndSerachBarProps> = ({
    isVisible = true,
    onFilterChange,
    onSortChange,
    onSearchChange,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortByOpen, setIsSortByOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedSortBy, setSelectedSortBy] = useState('relevance');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        fastDelivery: false,
        newProducts: false,
        rating4Plus: false,
        pureVeg: false,
        offers: false,
        price300to600: false,
        priceLess300: false,
    });

    const sortByRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { id: 'relevance', label: 'Relevance', description: 'Best match for you' },
        { id: 'rating', label: 'Rating', description: 'Highest rated first' },
        {
            id: 'deliveryTime',
            label: 'Delivery Time',
            description: 'Fastest first',
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
        {
            id: 'popularity',
            label: 'Popularity',
            description: 'Most ordered first',
        },
    ];

    const quickFilters = [
        {
            id: 'fastDelivery' as keyof ActiveFilters,
            label: 'Fast Delivery',
            icon: 'zap',
            color: 'text-green-500',
            activeColor: 'bg-green-100 text-green-700 border-green-300',
        },
        {
            id: 'newProducts' as keyof ActiveFilters,
            label: 'New',
            icon: 'sparkles',
            color: 'text-purple-500',
            activeColor: 'bg-purple-100 text-purple-700 border-purple-300',
        },
        {
            id: 'rating4Plus' as keyof ActiveFilters,
            label: 'Rating 4.0+',
            icon: 'star',
            color: 'text-yellow-500',
            activeColor: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        },
        {
            id: 'pureVeg' as keyof ActiveFilters,
            label: 'Pure Veg',
            icon: 'leaf',
            color: 'text-green-600',
            activeColor: 'bg-green-100 text-green-700 border-green-300',
        },
        {
            id: 'offers' as keyof ActiveFilters,
            label: 'Offers',
            icon: 'tag',
            color: 'text-red-500',
            activeColor: 'bg-red-100 text-red-700 border-red-300',
        },
        {
            id: 'price300to600' as keyof ActiveFilters,
            label: '₹300-600',
            icon: null,
            color: 'text-blue-500',
            activeColor: 'bg-blue-100 text-blue-700 border-blue-300',
        },
        {
            id: 'priceLess300' as keyof ActiveFilters,
            label: 'Less than ₹300',
            icon: null,
            color: 'text-indigo-500',
            activeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        },
    ];

    useEffect(() => {
        const handleClickOutside = (eventValue: MouseEvent) => {
            const event = eventValue;
            if (sortByRef.current && !sortByRef.current.contains(event.target as Node)) {
                setIsSortByOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleQuickFilterToggle = (filterId: keyof ActiveFilters) => {
        const newFilters = {
            ...activeFilters,
            [filterId]: !activeFilters[filterId],
        };
        setActiveFilters(newFilters);
        onFilterChange && onFilterChange(newFilters);
    };

    const handleSortChange = (sortId: string) => {
        setSelectedSortBy(sortId);
        setIsSortByOpen(false);
        onSortChange && onSortChange(sortId);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchChange && onSearchChange(searchQuery);
    };

    const clearAllFilters = () => {
        const clearedFilters = (Object.keys(activeFilters) as Array<keyof ActiveFilters>).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as ActiveFilters);
        setActiveFilters(clearedFilters);
        onFilterChange && onFilterChange(clearedFilters);
    };

    const getActiveFiltersCount = () => {
        return Object.values(activeFilters).filter(Boolean).length;
    };

    return (
        <div
            className={`fixed top-0 right-0 left-0 z-40 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="border-border border-b bg-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <div className="flex items-center justify-between py-4">
                            {/* Left Side - Quick Filters */}
                            <div className="scrollbar-hide flex flex-1 items-center space-x-2 overflow-x-auto">
                                {quickFilters.slice(0, 5).map(filter => {
                                    const isActive = activeFilters[filter.id];

                                    return (
                                        <button
                                            key={filter.id}
                                            onClick={() => handleQuickFilterToggle(filter.id)}
                                            className={`flex items-center space-x-2 rounded-xl border px-3 py-2 font-medium whitespace-nowrap transition-all duration-200 ${isActive
                                                    ? filter.activeColor
                                                    : 'bg-bg-subtle text-text-secondary border-border hover:bg-gray-100'
                                                }`}
                                        >
                                            {filter.icon && <Icon name={filter.icon as any} size={16} />}
                                            <span className="text-sm">{filter.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Side - Controls */}
                            <div className="ml-4 flex items-center space-x-3">
                                {/* Search Bar */}
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Icon
                                        name="search"
                                        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search restaurants..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="border-border focus:border-border-focus w-48 rounded-xl border py-2 pr-4 pl-10 text-sm focus:outline-none"
                                    />
                                </form>

                                {/* Sort By Dropdown */}
                                <div className="relative" ref={sortByRef}>
                                    <button
                                        onClick={() => setIsSortByOpen(!isSortByOpen)}
                                        className="bg-bg-subtle text-text-secondary border-border flex items-center space-x-2 rounded-xl border px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
                                    >
                                        <span className="text-sm">Sort By</span>
                                        <Icon
                                            name="chevron-down"
                                            size={16}
                                            className={`transform transition-transform ${isSortByOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {isSortByOpen && (
                                        <div className="border-border absolute top-full right-0 mt-2 w-72 rounded-2xl border bg-white shadow-lg">
                                            <div className="border-b border-gray-100 p-4">
                                                <h3 className="text-text-main font-bold">Sort By</h3>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto p-2">
                                                {sortOptions.map(option => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleSortChange(option.id)}
                                                        className="hover:bg-bg-subtle flex w-full items-center justify-between rounded-xl p-3 transition-colors"
                                                    >
                                                        <div className="text-left">
                                                            <p className="text-text-main text-sm font-medium">
                                                                {option.label}
                                                            </p>
                                                            <p className="text-text-secondary text-xs">
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

                                {/* Advanced Filter Button */}
                                <div className="relative" ref={filterRef}>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="bg-bg-subtle text-text-secondary border-border flex items-center space-x-2 rounded-xl border px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
                                    >
                                        <Icon name="filter" size={16} />
                                        <span className="text-sm">Filter</span>
                                        {getActiveFiltersCount() > 0 && (
                                            <span className="bg-primary text-text-main rounded-full px-2 py-1 text-xs font-bold">
                                                {getActiveFiltersCount()}
                                            </span>
                                        )}
                                    </button>

                                    {isFilterOpen && (
                                        <div className="border-border absolute top-full right-0 mt-2 w-80 rounded-2xl border bg-white shadow-lg">
                                            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                                                <h3 className="text-text-main font-bold">
                                                    All Filters
                                                </h3>
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="text-sm font-medium text-yellow-400 hover:text-yellow-500"
                                                >
                                                    Clear All
                                                </button>
                                            </div>

                                            <div className="max-h-80 overflow-y-auto p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-text-main mb-3 font-semibold">
                                                            Quick Filters
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {quickFilters.map(filter => {
                                                                const isActive = activeFilters[filter.id];

                                                                return (
                                                                    <button
                                                                        key={filter.id}
                                                                        onClick={() =>
                                                                            handleQuickFilterToggle(filter.id)
                                                                        }
                                                                        className={`flex items-center space-x-2 rounded-xl border p-3 text-sm transition-all duration-200 ${isActive
                                                                                ? filter.activeColor
                                                                                : 'bg-bg-subtle text-text-secondary border-border hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        {filter.icon && (
                                                                            <Icon name={filter.icon as any} size={14} />
                                                                        )}
                                                                        <span>{filter.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
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

                        {/* Active Filters Display */}
                        {getActiveFiltersCount() > 0 && (
                            <div className="pb-4">
                                <div className="flex flex-wrap items-center space-x-2">
                                    <span className="text-text-secondary text-sm">
                                        Active filters:
                                    </span>
                                    {Object.entries(activeFilters).map(([key, isActive]) => {
                                        if (!isActive) return null;
                                        const filter = quickFilters.find(f => f.id === key);
                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
                                            >
                                                <span>{filter?.label}</span>
                                                <button
                                                    onClick={() => handleQuickFilterToggle(key as keyof ActiveFilters)}
                                                    className="rounded-full p-0.5 hover:bg-yellow-200"
                                                >
                                                    <Icon name="x" size={12} />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-text-muted hover:text-text-secondary text-sm underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile & Tablet View */}
                    <div className="py-3 lg:hidden">
                        {/* Top Row - Quick Filters Scroll */}
                        <div className="scrollbar-hide flex items-center space-x-2 overflow-x-auto pb-3">
                            {quickFilters.slice(0, 4).map(filter => {
                                const isActive = activeFilters[filter.id];

                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => handleQuickFilterToggle(filter.id)}
                                        className={`flex items-center space-x-1.5 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${isActive
                                                ? filter.activeColor
                                                : 'bg-bg-subtle text-text-secondary border-border hover:bg-gray-100'
                                            }`}
                                    >
                                        {filter.icon && <Icon name={filter.icon as any} size={14} />}
                                        <span>{filter.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Bottom Row - Action Buttons */}
                        <div className="flex items-center space-x-2">
                            {/* Search Button */}
                            <div className="relative flex-1" ref={searchRef}>
                                {!isSearchOpen ? (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="bg-bg-subtle text-text-secondary border-border flex w-full items-center justify-center space-x-2 rounded-lg border px-3 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
                                    >
                                        <Icon name="search" size={16} />
                                        <span className="text-sm">Search</span>
                                    </button>
                                ) : (
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <Icon
                                            name="search"
                                            className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="border-border focus:border-border-focus w-full rounded-lg border py-2 pr-10 pl-10 text-sm focus:outline-none"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400"
                                        >
                                            <Icon name="x" size={16} />
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Sort By Button */}
                            <div className="relative" ref={sortByRef}>
                                <button
                                    onClick={() => setIsSortByOpen(!isSortByOpen)}
                                    className="bg-bg-subtle text-text-secondary border-border flex items-center space-x-1.5 rounded-lg border px-3 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
                                >
                                    <Icon name="arrow-up-down" size={16} />
                                    <span className="text-sm">Sort</span>
                                </button>

                                {isSortByOpen && (
                                    <div className="border-border absolute top-full right-0 z-50 mt-2 w-72 rounded-2xl border bg-white shadow-lg">
                                        <div className="border-b border-gray-100 p-4">
                                            <h3 className="text-text-main font-bold">Sort By</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto p-2">
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleSortChange(option.id)}
                                                    className="hover:bg-bg-subtle flex w-full items-center justify-between rounded-xl p-3 transition-colors"
                                                >
                                                    <div className="text-left">
                                                        <p className="text-text-main text-sm font-medium">
                                                            {option.label}
                                                        </p>
                                                        <p className="text-text-secondary text-xs">
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

                            {/* Filter Button */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="bg-bg-subtle text-text-secondary border-border flex items-center space-x-1.5 rounded-lg border px-3 py-2 font-medium transition-colors duration-200 hover:bg-gray-100"
                                >
                                    <Icon name="filter" size={16} />
                                    <span className="text-sm">Filter</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="bg-primary text-text-main rounded-full px-1.5 py-0.5 text-xs font-bold">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                </button>

                                {isFilterOpen && (
                                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-end bg-black sm:items-center sm:justify-center">
                                        <div className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white sm:w-96 sm:rounded-2xl">
                                            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                                                <h3 className="text-text-main font-bold">
                                                    All Filters
                                                </h3>
                                                <button
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="hover:text-text-secondary text-gray-400"
                                                >
                                                    <Icon name="x" size={24} />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h4 className="text-text-main font-semibold">
                                                                Quick Filters
                                                            </h4>
                                                            <button
                                                                onClick={clearAllFilters}
                                                                className="text-sm font-medium text-yellow-400 hover:text-yellow-500"
                                                            >
                                                                Clear All
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {quickFilters.map(filter => {
                                                                const isActive = activeFilters[filter.id];

                                                                return (
                                                                    <button
                                                                        key={filter.id}
                                                                        onClick={() =>
                                                                            handleQuickFilterToggle(filter.id)
                                                                        }
                                                                        className={`flex items-center space-x-2 rounded-xl border p-3 text-sm transition-all duration-200 ${isActive
                                                                                ? filter.activeColor
                                                                                : 'bg-bg-subtle text-text-secondary border-border hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        {filter.icon && (
                                                                            <Icon name={filter.icon as any} size={14} />
                                                                        )}
                                                                        <span>{filter.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
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
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Filters Display - Mobile */}
                        {getActiveFiltersCount() > 0 && (
                            <div className="pt-3">
                                <div className="scrollbar-hide flex items-center space-x-2 overflow-x-auto">
                                    <span className="text-text-secondary text-xs whitespace-nowrap">
                                        Active:
                                    </span>
                                    {Object.entries(activeFilters).map(([key, isActive]) => {
                                        if (!isActive) return null;
                                        const filter = quickFilters.find(f => f.id === key);
                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-2 py-1 text-xs whitespace-nowrap text-yellow-800"
                                            >
                                                <span>{filter?.label}</span>
                                                <button
                                                    onClick={() => handleQuickFilterToggle(key as keyof ActiveFilters)}
                                                    className="rounded-full p-0.5 hover:bg-yellow-200"
                                                >
                                                    <Icon name="x" size={10} />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-text-muted hover:text-text-secondary text-xs whitespace-nowrap underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersAndSerachBar;
