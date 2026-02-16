import React from 'react';

import Icon from '../../../components/ui/Icon';
import { useCartActions } from '../hooks/use-cart-actions';
import { ICartItem } from '../../../types/domain-models';

interface CartItemProps {
    item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const product = item.product;

    const { handleUpdateQuantity, handleOpenDeleteModal } = useCartActions();

    // Calculate the original price based on the product's price and promotional discount
    const originalPrice = product.promotionalDiscount?.value
        ? product.price + product.promotionalDiscount.value
        : product.price;

    // Function to handle increasing the quantity
    const handleIncrement = () => {
        const newQuantity = item.quantity + 1;
        handleUpdateQuantity({ itemId: item._id, quantity: newQuantity });
    };

    // Function to handle decreasing the quantity
    const handleDecrement = () => {
        if (item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            handleUpdateQuantity({ itemId: item._id, quantity: newQuantity });
        }
    };

    return (
        <div className="flex items-center space-x-4 border-b border-gray-100 px-1 py-2 last:border-b-0 last:pb-0">
            {/* Thumbnail */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                <img
                    src={
                        product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://placehold.co/80x80/e5f0ff/5280cc?text=No+Image'
                    }
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Info & Quantity Controls */}
            <div className="flex min-w-0 flex-grow items-center justify-between">
                <div className="flex flex-grow flex-col">
                    <h3 className="text-text-main truncate text-base font-semibold">
                        {product.name}
                    </h3>
                    {product.restaurant && typeof product.restaurant !== 'string' && (
                        <p className="text-text-muted mt-0.5 truncate text-sm">
                            Restaurant: {product.restaurant.name}
                        </p>
                    )}

                    {Array.isArray(item.customizations) &&
                        item.customizations.length > 0 && (
                            <p className="truncate text-xs text-gray-400">
                                {item.customizations.join(', ')}
                            </p>
                        )}

                    {/* Price and Total */}
                    <div className="mt-1 flex items-center space-x-4">
                        <div className="flex flex-col">
                            <span className="text-text-secondary text-sm font-semibold">
                                ₹{product.price.toFixed(2)}
                            </span>
                            {/* Check if a promotional discount exists */}
                            {product.promotionalDiscount && product.promotionalDiscount.value > 0 && (
                                <span className="ml-1 text-xs text-gray-400 line-through">
                                    ₹{originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center">
                            <span className="text-text-secondary text-sm font-normal">
                                Total:
                            </span>
                            <span className="text-text-main ml-1 flex items-center text-sm font-semibold">
                                <Icon name="indian-rupee" className="h-3 w-3" />
                                <div className="flex items-center">
                                    {(item.quantity * product.price).toFixed(2)}{' '}
                                    <span className="ml-1 text-text-muted"> | Qty {item.quantity}</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-shrink-0 items-center space-x-1">
                    <button
                        onClick={handleDecrement}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                    >
                        <Icon name="minus" size={14} className="text-text-secondary" />
                    </button>
                    <span className="text-text-main w-5 text-center text-sm font-semibold">
                        {item.quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="bg-primary hover:bg-primary-hover flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors"
                    >
                        <Icon name="plus" size={14} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Remove */}
            <button
                onClick={() => handleOpenDeleteModal(product.name, item._id)}
                className="ml-1 flex-shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-red-500"
            >
                <Icon name="trash-2" size={18} />
            </button>
        </div>
    );
};

export default CartItem;
