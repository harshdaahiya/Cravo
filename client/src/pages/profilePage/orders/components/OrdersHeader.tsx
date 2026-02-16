import React from 'react';

interface OrdersHeaderProps {
    ordersCount: number;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ ordersCount }) => {
    return (
        <div>
            <h1 className="text-text-main text-3xl font-bold">My Orders</h1>
            <p className="text-text-secondary mt-1">
                {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
            </p>
        </div>
    );
};

export default OrdersHeader;
