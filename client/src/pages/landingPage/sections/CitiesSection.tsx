import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { ICity } from '../../../types/domain-models';
import { CITIES_CONFIG } from '../../../config/landing';

interface CityCardProps {
    city: ICity;
    onClick: (cityName: string) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => (
    <div className="mb-4 px-2 sm:px-3" onClick={() => onClick(city.name)}>
        <div className="cursor-pointer border-border flex flex-col items-center justify-center rounded-xl border bg-background py-5 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
            <span className="text-text-secondary text-center text-sm font-medium">
                {city.name}
            </span>
        </div>
    </div>
);

const CitiesSection: React.FC = () => {
    const { data, isAppInitializing: isLoading, appInitError: error } = useSelector((state: RootState) => state.landingPage);
    const citiesData = data.cities;

    const [cities, setCities] = useState<ICity[]>([]);
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    // Number of cities to show initially
    const INITIAL_CITIES_COUNT = CITIES_CONFIG.initialVisibleCount;

    useEffect(() => {
        if (citiesData) {
            setCities(citiesData);
        }
    }, [citiesData]);

    // Get cities to display based on showAll state
    const citiesToDisplay = showAll
        ? cities
        : cities.slice(0, INITIAL_CITIES_COUNT);
    const hasMoreCities = cities.length > INITIAL_CITIES_COUNT;

    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleShowLess = () => {
        setShowAll(false);
    };

    const handleCityClick = (cityName: string) => {
        navigate(`/restaurants?cityName=${cityName}`);
    };

    return (
        <section className="mb-2 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <div className="mt-15 mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-foreground text-xl font-bold">
                            {CITIES_CONFIG.heading}
                        </h2>
                        <p className="text-text-secondary mt-1 text-sm">
                            {CITIES_CONFIG.subheading}
                        </p>
                    </div>
                </div>

                {/* Cities Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {citiesToDisplay.map(city => (
                        <CityCard key={city._id} city={city} onClick={handleCityClick} />
                    ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreCities && (
                    <div className="mt-6 flex justify-center">
                        {!showAll ? (
                            <button
                                onClick={handleShowMore}
                                className="bg-primary-hover rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover"
                            >
                                {CITIES_CONFIG.showMoreTextPrefix} ({cities.length - INITIAL_CITIES_COUNT})
                            </button>
                        ) : (
                            <button
                                onClick={handleShowLess}
                                className="rounded-lg bg-muted px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-muted"
                            >
                                {CITIES_CONFIG.showLessText}
                            </button>
                        )}
                    </div>
                )}

                {/* Loading and Error States */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">{CITIES_CONFIG.loadingText}</div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-destructive">{CITIES_CONFIG.errorText}</div>
                    </div>
                )}

                {!isLoading && !error && cities.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">{CITIES_CONFIG.noDataText}</div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CitiesSection;
