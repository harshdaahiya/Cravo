import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    selectDefaultProductListId,
    selectIsProductInAnyProductList,
} from '../../features/wishlist';
import { useAuthForm } from '../../features/auth';
import { useCartActions } from '../../features/cart';
import { useWishlistActions } from '../../features/wishlist';
import Icon from '../ui/Icon';
import { RootState } from '../../store';
import { IProduct } from '../../types/domain-models';

interface ProductCardProps {
    item: IProduct;
    listId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, listId }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { handleOpenAuthRequireModal } = useAuthForm();

    const { handleAddToCart, handleUpdateQuantity } = useCartActions();
    const { lists, handleAddItemToWishlist, handleRemoveItemFromWishlist } =
        useWishlistActions();

    const isProductInWishlist = useSelector((state: RootState) =>
        selectIsProductInAnyProductList(state, item._id)
    );

    const existingCartItem = useSelector((state: RootState) =>
        state.cart.items.find(cartItem => cartItem.product._id === item._id)
    );

    const defaultProductListId = useSelector((state: RootState) => selectDefaultProductListId(state));

    const handleWishlistClick = () => {
        // Finding the list where this item exists
        const listWithItem = lists.find(list =>
            list.items?.some(productItem => productItem._id === item._id)
        );

        // Finding the default list object to get its name
        const defaultList = lists.find(list => list._id === defaultProductListId);

        if (listId) {
            // Scenario 1: On a specific wishlist page (listId is provided).
            const listName =
                lists.find(list => list._id === listId)?.name || 'Wishlist';

            handleRemoveItemFromWishlist({
                listId: listId,
                itemId: item._id,
                itemType: 'product',
                listName: listName,
                itemName: item.name,
            });
        } else if (isProductInWishlist && listWithItem) {
            // Scenario 2: On other pages where the item is ALREADY in a wishlist.
            handleRemoveItemFromWishlist({
                listId: listWithItem._id,
                itemId: item._id,
                itemType: 'product',
                listName: listWithItem.name,
                itemName: item.name,
            });
        } else {
            // Scenario 3: On other pages where the item is NOT in a wishlist.
            handleAddItemToWishlist({
                listId: defaultProductListId || '',
                itemId: item._id,
                itemType: 'product',
                itemName: item.name,
                listName: defaultList?.name || 'My Favorites',
            });
        }
    };

    const handleIncrement = () => {
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + 1;
            handleUpdateQuantity({
                itemId: existingCartItem._id,
                quantity: newQuantity,
            });
        }
    };

    // Function to handle decreasing the quantity
    const handleDecrement = () => {
        if (existingCartItem && existingCartItem.quantity > 1) {
            const newQuantity = existingCartItem.quantity - 1;
            handleUpdateQuantity({
                itemId: existingCartItem._id,
                quantity: newQuantity,
            });
        }
    };

    return (
        <div
            className="relative flex flex-col rounded-2xl bg-white shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
            {/* Image Section */}
            <div className="relative overflow-hidden rounded-t-2xl">
                {(item.images && item.images.length > 0) ? (
                    <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-28 w-full rounded-t-2xl object-cover"
                    />
                ) : item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-full rounded-t-2xl object-cover"
                    />
                ) : null}

                {/* Wishlist */}
                <button
                    onClick={
                        isAuthenticated ? handleWishlistClick : handleOpenAuthRequireModal
                    }
                    className={`absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1.5 shadow-md transition-colors duration-200 ${isProductInWishlist
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                >
                    <Icon name="heart" className="h-4 w-4 fill-current" />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col p-3">
                {/* Top Section */}
                <div className="mb-2">
                    {item.isBestseller && (
                        <span className="mb-1 inline-flex items-center text-xs font-semibold text-amber-500">
                            <Icon name="star" className="mr-1 h-3.5 w-3.5 fill-current" />{' '}
                            Bestseller
                        </span>
                    )}
                    <h3 className="text-text-main line-clamp-1 text-base font-bold">
                        {item.name}
                    </h3>
                    <p className="text-text-muted line-clamp-2 text-xs">
                        {item.description}
                    </p>
                </div>

                {/* Bottom Section (Price + Actions) */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2">
                    {/* Price */}
                    <div className="flex items-center">
                        <Icon name="indian-rupee" className="text-text-main mr-1 h-4 w-4" />
                        <span className="text-text-main text-base font-extrabold">
                            {item.price}
                        </span>
                    </div>

                    {/* Add to Cart / Quantity */}
                    {existingCartItem ? (
                        <div className="flex items-center space-x-1.5 rounded-full border border-yellow-200 bg-white px-2 py-0.5">
                            <button
                                onClick={handleDecrement}
                                className="bg-primary text-text-main hover:bg-primary-hover flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-semibold transition-colors duration-200"
                            >
                                -
                            </button>
                            <span className="text-text-main text-sm font-bold">
                                {existingCartItem.quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                className="bg-primary text-text-main hover:bg-primary-hover flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-semibold transition-colors duration-200"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleAddToCart(item._id)}
                            className="bg-primary text-text-main hover:bg-primary-hover flex cursor-pointer items-center rounded-full px-3 py-1.5 text-sm font-semibold shadow-md transition-colors duration-200"
                        >
                            <Icon name="shopping-cart" className="mr-1 h-4 w-4" /> Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
