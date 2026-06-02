import React, { useEffect, useRef, FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { setUserLocation } from '../../../features/location';
import { useSearchContext } from '../../../features/search-context';
import { RootState, AppDispatch } from '../../../store';
import { HERO_CONTENT, HERO_FEATURES, SUPPORTED_CITIES } from '../../../config/hero';

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
                            {HERO_CONTENT.titleParts.map((part, index) => (
                                part.isHighlight ? (
                                    <span key={index} className="relative inline-block">
                                        <span className="text-main relative z-10">{part.text}</span>
                                        <span className="absolute bottom-2 left-0 -z-0 h-3 w-full rounded-ss-4xl rounded-se-4xl bg-background"></span>
                                    </span>
                                ) : (
                                    <span key={index} className="text-main">{part.text}</span>
                                )
                            ))}
                        </h1>
                        <p className="text-text-secondary max-w-xl text-center text-base font-medium sm:text-left sm:text-lg md:text-xl">
                            {HERO_CONTENT.description}
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="border-border rounded-2xl border bg-background p-4 shadow-lg sm:p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                                {/* Location Search */}
                                <div className="relative" ref={locationRef}>
                                    <Icon
                                        name="map-pin"
                                        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform sm:left-4"
                                        size={18}
                                    />
                                    <input
                                        id="hero-location-input"
                                        type="text"
                                        placeholder={locationPlaceholder}
                                        value={locationSearchTerm}
                                        onChange={handleLocationChange}
                                        onFocus={handleInputFocus}
                                        aria-label="Location search query"
                                        className="border-border focus:border-border-focus text-foreground w-full rounded-xl border-2 py-3 pr-10 pl-10 text-sm font-medium focus:outline-none sm:py-4 sm:pl-12 sm:text-base focus-visible:ring-2 focus-visible:ring-primary"
                                    />
                                    <Icon
                                        name={isLocationLoading ? 'loading' : 'chevron-down'}
                                        className={`text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transform sm:right-4 ${isLocationLoading ? 'animate-spin' : ''
                                            }`}
                                        size={18}
                                        aria-hidden="true"
                                    />

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions &&
                                        (suggestions.length > 0 || isLocationLoading) && (
                                            <div 
                                                className="border-border absolute z-10 mt-2 max-h-64 w-full overflow-hidden overflow-y-auto rounded-xl border bg-background shadow-2xl"
                                                role="listbox"
                                                aria-label="Location suggestions"
                                            >
                                                <div
                                                    className="hover:bg-muted flex cursor-pointer items-center gap-3 p-4 text-sm font-medium text-info focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                    onClick={handleUseCurrentLocation}
                                                    role="option"
                                                    aria-selected="false"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleUseCurrentLocation();
                                                        }
                                                    }}
                                                >
                                                    <Icon name="locate-fixed" size={18} aria-hidden="true" />
                                                    <span>{HERO_CONTENT.useCurrentLocationText}</span>
                                                </div>
                                                <hr className="border-border" aria-hidden="true" />

                                                {isLocationLoading && (
                                                    <div className="text-muted-foreground p-4 text-center text-sm">
                                                        {HERO_CONTENT.suggestionLoadingText}
                                                    </div>
                                                )}
                                                {!isLocationLoading && suggestions.length > 0 && (
                                                    <ul>
                                                        {suggestions.map((location, index) => (
                                                            <li
                                                                key={index}
                                                                className="hover:bg-bg-subtle text-text-secondary cursor-pointer px-4 py-3 text-sm font-medium focus-visible:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                                onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
                                                                onClick={() => handleSelectLocation(location)}
                                                                role="option"
                                                                aria-selected="false"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        handleSelectLocation(location);
                                                                    }
                                                                }}
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
                                        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform sm:left-4"
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="hero-food-input"
                                        type="text"
                                        placeholder={HERO_CONTENT.searchPlaceholderText}
                                        value={categoryName}
                                        onChange={handleCategoryChange}
                                        aria-label="Food, category, or restaurant search query"
                                        className="border-border focus:border-border-focus text-foreground w-full rounded-xl border-2 py-3 pr-10 pl-10 text-sm font-medium focus:outline-none sm:py-4 sm:pl-12 sm:text-base focus-visible:ring-2 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSearchSubmit}
                                disabled={!selectedLocation || isLocationLoading}
                                aria-label="Search restaurants"
                                className="bg-primary hover:bg-primary-hover text-foreground w-full cursor-pointer rounded-xl py-3 text-sm font-bold shadow-md transition-colors disabled:opacity-50 sm:py-4 sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                {HERO_CONTENT.submitButtonText}
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
                                            {HERO_FEATURES.mainEmoji}
                                        </div>
                                        <p className="text-foreground text-base font-bold sm:text-lg">
                                            {HERO_FEATURES.title}
                                        </p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            {HERO_FEATURES.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {HERO_FEATURES.badges.map((badge, index) => (
                                    <div key={index} className={`absolute rounded-full px-2 py-1 text-xs font-bold shadow-lg sm:px-4 sm:py-2 sm:text-sm ${badge.positionClass} ${badge.bgClass} ${badge.extraClass || ''}`}>
                                        {badge.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
