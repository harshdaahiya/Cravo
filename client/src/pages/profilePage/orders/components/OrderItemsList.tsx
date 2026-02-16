import React from 'react';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    customizations: string[];
}

interface OrderItemsListProps {
    items: OrderItem[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
    return (
        <div>
            <h4 className="text-text-main mb-3 font-semibold">Order Items</h4>
            <div className="space-y-3">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg bg-white p-3"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <p className="text-text-main font-medium">
                                {item.quantity}× {item.name}
                            </p>
                            {item.customizations.length > 0 && (
                                <p className="text-text-muted mt-0.5 text-xs">
                                    {item.customizations.join(', ')}
                                </p>
                            )}
                        </div>
                        <p className="text-text-main font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderItemsList;
