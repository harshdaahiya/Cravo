import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectDefaultRestaurantListId,
    selectIsRestaurantInAnyRestaurantList,
} from '../../features/wishlist';
import { useAuthForm } from '../../features/auth';
import { useWishlistActions } from '../../features/wishlist';
import Icon from '../ui/Icon';
import { RootState } from '../../store';
import { IRestaurant } from '../../types/domain-models';

interface RestaurantCardProps {
    data: IRestaurant;
    listId?: string;
    className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ data, listId, className = '' }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { lists, handleAddItemToWishlist, handleRemoveItemFromWishlist } =
        useWishlistActions();

    const isRestaurantInWishlist = useSelector((state: RootState) =>
        selectIsRestaurantInAnyRestaurantList(state, data._id)
    );

    const { handleOpenAuthRequireModal } = useAuthForm();

    const defaultRestaurantListId = useSelector((state: RootState) => selectDefaultRestaurantListId(state));

    const handleWishlistClick = () => {
        // Finding the list where this item exists
        const listWithRestaurant = lists.find(list =>
            list.restaurants?.some(restaurant =>
                typeof restaurant === 'string' ? restaurant === data._id : restaurant._id === data._id
            )
        );

        // Finding the default list object to get its name
        const defaultList = lists.find(
            list => list._id === defaultRestaurantListId
        );

        if (listId) {
            // Scenario 1: On a specific wishlist page (listId is provided).
            const listName =
                lists.find(list => list._id === listId)?.name || 'Wishlist';

            handleRemoveItemFromWishlist({
                listId: listId,
                itemId: data._id,
                itemType: 'restaurant',
                listName: listName,
                itemName: data.name,
            });
        } else if (isRestaurantInWishlist && listWithRestaurant) {
            // Scenario 2: On other pages where the item is ALREADY in a wishlist.
            handleRemoveItemFromWishlist({
                listId: listWithRestaurant._id,
                itemId: data._id,
                itemType: 'restaurant',
                listName: listWithRestaurant.name,
                itemName: data.name,
            });
        } else {
            // Scenario 3: On other pages where the item is NOT in a wishlist.
            handleAddItemToWishlist({
                listId: defaultRestaurantListId || '',
                itemId: data._id,
                itemType: 'restaurant',
                itemName: data.name,
                listName: defaultList?.name || 'My Favorites',
            });
        }
    };

    const onFavoriteButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (isAuthenticated) {
            handleWishlistClick();
        } else {
            handleOpenAuthRequireModal();
        }
    };

    const baseContainerClasses =
        'bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden border border-gray-100';

    const cardLayoutClasses = 'w-full flex flex-col';
    const imageContainerClasses = 'relative flex-shrink-0 overflow-hidden h-36'; // Fixed height for grid
    const contentContainerClasses = 'px-4 py-3 flex flex-col flex-grow space-y-2';

    const finalContainerClasses = `${baseContainerClasses} ${cardLayoutClasses} ${className}`;
    const imageUrl =
        data.images?.[0] ||
        'https://placehold.co/400x240/f0f0f0/808080?text=Restaurant';

    return (
        <div className={finalContainerClasses}>
            {/* IMAGE CONTAINER */}
            <div className={imageContainerClasses}>
                <img
                    src={imageUrl}
                    alt={data.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={e => {
                        (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x240/f0f0f0/808080?text=Restaurant';
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Min order badge (Grid placement) */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2 py-1 shadow-md backdrop-blur-sm">
                    <span className="text-text-main text-sm font-bold">
                        Min ₹{data.min_order_value}
                    </span>
                </div>

                {/* Delivery time badge (Grid placement) */}
                <div className="text-text-main absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold shadow-md">
                    {data.delivery_time_mins}m
                </div>

                {/* Favorite button */}
                <button
                    onClick={onFavoriteButtonClick}
                    className={`absolute top-3 left-3 z-10 cursor-pointer rounded-full bg-white/80 p-2 transition-all duration-200 hover:bg-white ${isRestaurantInWishlist
                        ? 'text-red-500 opacity-100'
                        : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
                        }`}
                >
                    <Icon name="heart" size={16} className="h-4 w-4 fill-current" />
                </button>
            </div>

            {/* CONTENT SECTION */}
            <div className={contentContainerClasses}>
                {/* Restaurant name */}
                <h3 className="text-text-main line-clamp-1 text-lg leading-tight font-bold transition-colors group-hover:text-yellow-500">
                    {data.name}
                </h3>

                {/* Cuisine tags */}
                <div className="text-text-secondary flex items-center gap-1 overflow-hidden text-xs font-medium whitespace-nowrap">
                    {data.cuisine_type?.slice(0, 4).map((cuisine, idx) => (
                        <span key={cuisine}>
                            {cuisine}
                            {idx < (data.cuisine_type?.slice(0, 4).length || 0) - 1 && ' •'}
                        </span>
                    ))}
                    {/* Adding ellipsis if there are more than 4 items */}
                    {(data.cuisine_type?.length || 0) > 4 && <span>...</span>}
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5">
                        <Icon
                            name="star"
                            size={14}
                            className="fill-current text-emerald-600"
                        />
                        <span className="text-sm font-semibold text-emerald-700">
                            {data.rating}
                        </span>
                    </div>
                    {data.numberOfReviews > 0 && (
                        <span className="text-text-muted text-sm">
                            ({data.numberOfReviews}+ reviews)
                        </span>
                    )}
                </div>

                {/* Footer Info (Delivery Time & Veg Status) */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                    <span className="text-text-secondary font-medium">
                        {data.delivery_time_mins} mins
                    </span>
                    <span className="font-semibold text-emerald-600">
                        {data.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                </div>

                {/* Address (Street) */}
                <div className="">
                    {(data.address as any)?.street && (
                        <p className="text-text-muted truncate text-sm text-shadow-xs">
                            {(data.address as any).street}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
