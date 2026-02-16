import React from 'react';
import { Link } from 'react-router-dom';

import RestaurantCard from '../../../components/shared/RestaurantCard';
import RestaurantCardSkeleton from '../../../components/shared/RestaurantCardSkeleton';
import { IRestaurant } from '../../../types/domain-models';

interface RestaurantListProps {
    restaurants: IRestaurant[];
    isLoading: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, isLoading }) => {
    if (isLoading) {
        return (
            <div className="mt-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <RestaurantCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (restaurants.length === 0) {
        return (
            <p className="text-text-secondary mt-8 text-center text-lg">
                No restaurants found.
            </p>
        );
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants.map(restaurant => {
                    const restaurant_slug = restaurant.name
                        .toLowerCase()
                        .replace(/\s+/g, '-');
                    return (
                        <Link
                            to={`/menu/${restaurant_slug}/${restaurant._id}`}
                            key={restaurant._id}
                        >
                            <RestaurantCard data={restaurant} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RestaurantList;
