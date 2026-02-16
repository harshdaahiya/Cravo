import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ICity } from '../../../types/domain-models';

interface CityCardProps {
    city: ICity;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => (
    <div className="mb-4 px-2 sm:px-3">
        <div className="border-border flex flex-col items-center justify-center rounded-xl border bg-white py-5 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
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

    // Number of cities to show initially
    const INITIAL_CITIES_COUNT = 8;

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

    return (
        <section className="mb-2 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <div className="mt-15 mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-text-main text-xl font-bold">
                            Cities We Serve
                        </h2>
                        <p className="text-text-secondary mt-1 text-sm">
                            Bringing delicious food to your doorstep across India
                        </p>
                    </div>
                </div>

                {/* Cities Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {citiesToDisplay.map(city => (
                        <CityCard key={city._id} city={city} />
                    ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreCities && (
                    <div className="mt-6 flex justify-center">
                        {!showAll ? (
                            <button
                                onClick={handleShowMore}
                                className="bg-primary-hover rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-600"
                            >
                                Show More Cities ({cities.length - INITIAL_CITIES_COUNT})
                            </button>
                        ) : (
                            <button
                                onClick={handleShowLess}
                                className="rounded-lg bg-gray-500 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-600"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                )}

                {/* Loading and Error States */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-text-muted">Loading cities...</div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-red-500">Error loading cities</div>
                    </div>
                )}

                {!isLoading && !error && cities.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-text-muted">No cities available</div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CitiesSection;
