import React from 'react';
import RestaurantCard from '../../../../components/shared/RestaurantCard';
import { IRestaurant } from '../../../../types/domain-models';

interface RestaurantListCardProps {
    item: string | IRestaurant;
}

const RestaurantListCard: React.FC<RestaurantListCardProps> = ({ item }) => {
    return <RestaurantCard data={item} />;
};

export default RestaurantListCard;
