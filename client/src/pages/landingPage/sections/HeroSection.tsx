import React, { useEffect, useRef, useState, FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { setUserLocation } from '../../../features/location';
import { useSearchContext } from '../../../features/search-context';
import { RootState, AppDispatch } from '../../../store';

const SUPPORTED_CITIES = [
    'ahmadabad',
    'bangalore',
    'bhopal',
    'calcutta',
    'chennai',
    'delhi',
    'hyderabad',
    'indore',
    'jaipur',
    'kochi',
    'lucknow',
    'mumbai',
    'nagpur',
    'pune',
    'surat',
];

const Hero: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const locationRef = useRef<HTMLDivElement>(null);

    const initialIpLocation = useSelector((state: RootState) => state.location);

    const {
        locationSearchTerm,
        isLocationLoading,
        suggestions,
        showSuggestions,
        selectedLocation,
        categoryName,
        restaurantName,
        handleLocationChange,
        handleSelectLocation,
        handleUseCurrentLocation,
        handleCategoryChange,
        handleInputFocus,
        setShowSuggestions,
    } = useSearchContext();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowSuggestions]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!selectedLocation) {
            alert('Please select a location.');
            return;
        }

        const params = new URLSearchParams();
        const cityToCheck = selectedLocation.simpleCityName?.toLowerCase();

        if (cityToCheck && SUPPORTED_CITIES.includes(cityToCheck)) {
            params.set('cityName', selectedLocation.simpleCityName);
        } else {
            params.set('longitude', selectedLocation.lng.toString());
            params.set('latitude', selectedLocation.lat.toString());
        }

        if (categoryName.trim()) {
            params.set('categoryName', categoryName.trim());
        }
        if (restaurantName.trim()) {
            params.set('restaurantName', restaurantName.trim());
        }

        const payload = {
            city: selectedLocation.simpleCityName || '',
            lat: selectedLocation.lat,
            lon: selectedLocation.lng,
            country: initialIpLocation.country || '',
            countryCode: initialIpLocation.countryCode || '',
            region: initialIpLocation.region || '',
            regionName: initialIpLocation.regionName || '',
            zip: initialIpLocation.zip || '',
        };

        dispatch(setUserLocation(payload));

        navigate(`/restaurants?${params.toString()}`);
    };

    const locationPlaceholder = `${initialIpLocation.city || 'Enter City'}, ${initialIpLocation.region || 'Region'}, ${initialIpLocation.country || 'Country'}`;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-8 sm:pb-20">
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
                {/* LEFT SECTION */}
                <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-center text-3xl font-black italic sm:text-left sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="text-main block">Your Favorite</span>
                            <span className="text-main block">Food, </span>
                            <span className="relative inline-block">
                                <span className="text-main relative z-10">Delivered</span>
                                <span className="absolute bottom-2 left-0 -z-0 h-3 w-full rounded-ss-4xl rounded-se-4xl bg-white"></span>
                            </span>
                            <span className="text-main"> Fast</span>
                        </h1>
                        <p className="text-text-secondary max-w-xl text-center text-base font-medium sm:text-left sm:text-lg md:text-xl">
                            Order from 1000+ restaurants and get your cravings delivered in
                            just 30 minutes ⚡
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="border-border rounded-2xl border bg-white p-4 shadow-lg sm:p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                                {/* Location Search */}
                                <div className="relative" ref={locationRef}>
                                    <Icon
                                        name="map-pin"
                                        className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2 transform sm:left-4"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder={locationPlaceholder}
                                        value={locationSearchTerm}
                                        onChange={handleLocationChange}
                                        onFocus={handleInputFocus}
                                        className="border-border focus:border-border-focus text-text-main w-full rounded-xl border-2 py-3 pr-10 pl-10 text-sm font-medium focus:outline-none sm:py-4 sm:pl-12 sm:text-base"
                                    />
                                    <Icon
                                        name={isLocationLoading ? 'loading' : 'chevron-down'}
                                        className={`text-text-muted absolute top-1/2 right-3 -translate-y-1/2 transform sm:right-4 ${isLocationLoading ? 'animate-spin' : ''
                                            }`}
                                        size={18}
                                    />

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions &&
                                        (suggestions.length > 0 || isLocationLoading) && (
                                            <div className="border-border absolute z-10 mt-2 max-h-64 w-full overflow-hidden overflow-y-auto rounded-xl border bg-white shadow-2xl">
                                                <div
                                                    className="hover:bg-bg-subtle flex cursor-pointer items-center gap-3 p-4 text-sm font-medium text-blue-600"
                                                    onClick={handleUseCurrentLocation}
                                                >
                                                    <Icon name="locate-fixed" size={18} />
                                                    <span>Use My Current Location</span>
                                                </div>
                                                <hr className="border-border" />

                                                {isLocationLoading && (
                                                    <div className="text-text-muted p-4 text-center text-sm">
                                                        Loading...
                                                    </div>
                                                )}
                                                {!isLocationLoading && suggestions.length > 0 && (
                                                    <ul>
                                                        {suggestions.map((location, index) => (
                                                            <li
                                                                key={index}
                                                                className="hover:bg-bg-subtle text-text-secondary cursor-pointer px-4 py-3 text-sm font-medium"
                                                                onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
                                                                onClick={() => handleSelectLocation(location)}
                                                            >
                                                                {location.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {/* Category/Food Search */}
                                <div className="relative">
                                    <Icon
                                        name="search"
                                        className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2 transform sm:left-4"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pizza, Burger, Chinese..."
                                        value={categoryName}
                                        onChange={handleCategoryChange}
                                        className="border-border focus:border-border-focus text-text-main w-full rounded-xl border-2 py-3 pr-10 pl-10 text-sm font-medium focus:outline-none sm:py-4 sm:pl-12 sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSearchSubmit}
                                disabled={!selectedLocation || isLocationLoading}
                                className="bg-primary hover:bg-primary-hover text-text-main w-full cursor-pointer rounded-xl py-3 text-sm font-bold shadow-md transition-colors disabled:opacity-50 sm:py-4 sm:text-base"
                            >
                                Find Delicious Food
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION (Branding Circle) */}
                <div className="relative mt-8 lg:mt-0">
                    <div className="to-bg-subtle rounded-3xl bg-gradient-to-br from-white p-6 shadow-xl sm:p-8">
                        <div className="space-y-4 text-center sm:space-y-6">
                            <div className="relative">
                                <div className="from-primary to-primary-hover mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br shadow-lg sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                                    <div className="text-center">
                                        <div className="mb-2 text-4xl sm:mb-4 sm:text-5xl lg:text-6xl">
                                            🍽️
                                        </div>
                                        <p className="text-text-main text-base font-bold sm:text-lg">
                                            Premium Quality
                                        </p>
                                        <p className="text-text-secondary text-xs sm:text-sm">
                                            Fresh & Fast
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-secondary absolute -top-2 -left-2 rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg sm:-top-4 sm:-left-4 sm:px-4 sm:py-2 sm:text-sm">
                                    🌿 Fresh
                                </div>
                                <div className="bg-primary-hover text-text-main absolute -right-2 -bottom-2 rounded-full px-2 py-1 text-xs font-bold shadow-lg sm:-right-4 sm:-bottom-4 sm:px-4 sm:py-2 sm:text-sm">
                                    ⚡ 30 min
                                </div>
                                <div className="text-text-main border-border-focus absolute top-1/2 -right-4 rounded-full border-2 bg-white px-2 py-1 text-xs font-semibold shadow-lg sm:-right-8 sm:px-3 sm:py-2 sm:text-sm">
                                    1000+ 🏪
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
