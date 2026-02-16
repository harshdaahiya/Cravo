import React from 'react';

import CartItem from '../components/CartItem';
import { ICartItem } from '../../../types/domain-models';

interface CartItemsSectionProps {
    cartItems: ICartItem[];
}

const CartItemsSection: React.FC<CartItemsSectionProps> = ({ cartItems }) => {
    return (
        <div className="rounded-2xl bg-white p-2 shadow-md">
            <h2 className="text-text-main mb-2 text-lg font-bold">Items</h2>
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {cartItems.map(item => (
                    <CartItem key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default CartItemsSection;
