import React from 'react';

import Icon from '../../../components/ui/Icon';
import { IRestaurant } from '../../../types/domain-models';

interface RestaurantHeaderProps {
    restaurant: IRestaurant;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
    return (
        <div
            className="relative mb-6 h-64 overflow-hidden rounded-3xl bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url(${restaurant.images?.[0]})` }}
        >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
                <h1 className="mb-2 text-4xl font-bold text-white">
                    {restaurant.name}
                </h1>
                <p className="text-lg font-medium text-white">
                    {restaurant.cuisine_type?.join(', ')}
                </p>
                <div className="mt-2 flex items-center text-white">
                    <span className="mr-2 flex items-center rounded-full bg-green-500 px-2 py-1 text-sm font-semibold">
                        <Icon name="star" className="mr-1 h-4 w-4 fill-current" />{' '}
                        {restaurant.rating}
                    </span>
                    <span className="bg-primary text-text-main mr-2 flex items-center rounded-full px-2 py-1 text-sm">
                        <Icon name="timer" className="mr-1 h-4 w-4" />{' '}
                        {restaurant.delivery_time_mins} mins
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantHeader;
