import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    selectCartTotalQuantity,
    selectCartTotalValue,
} from '../../../features/cart';

const CartStatusSection: React.FC = () => {
    const cartCount = useSelector(selectCartTotalQuantity);
    const cartValue = useSelector(selectCartTotalValue);
    const navigate = useNavigate();

    // This component will not render anything if the cart is empty.
    if (cartCount === 0) {
        return null;
    }

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-gray-900 p-2 text-white shadow-lg">
            <div className="mx-auto flex max-w-md items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'} added
                    </span>
                    <span className="text-xl font-bold">₹{cartValue.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => {
                        navigate('/cart');
                    }}
                    className="bg-primary text-text-main hover:bg-primary-hover cursor-pointer rounded-full px-6 py-2 font-semibold transition-colors"
                >
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default CartStatusSection;
