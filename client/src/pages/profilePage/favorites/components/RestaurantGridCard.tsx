import React from 'react';
import RestaurantCard from '../../../../components/shared/RestaurantCard';
import { IRestaurant } from '../../../../types/domain-models';

interface RestaurantGridCardProps {
    item: string | IRestaurant;
    listId: string;
}

const RestaurantGridCard: React.FC<RestaurantGridCardProps> = ({ item, listId }) => {
    const restaurantData = typeof item === 'string' ? item : item;
    return <RestaurantCard data={restaurantData} listId={listId} />;
};

export default RestaurantGridCard;
