import React from 'react';

import BillSummary from '../components/BillSummary';
import DeliveryInfo from '../components/DeliveryInfo';
import OrderItemsList from '../components/OrderItemsList';

interface OrderDetailsProps {
    order: {
        items: any[];
        subtotal: number;
        deliveryFee: number;
        tax: number;
        discount: number;
        total: number;
        paymentMethod: string;
        deliveryAddress: string;
        deliveryInstructions?: string | null;
        driver?: any;
    };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    return (
        <div className="border-border bg-bg-subtle space-y-6 border-t p-6">
            <OrderItemsList items={order.items} />

            <BillSummary
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                tax={order.tax}
                discount={order.discount}
                total={order.total}
                paymentMethod={order.paymentMethod}
            />

            <DeliveryInfo
                address={order.deliveryAddress}
                instructions={order.deliveryInstructions}
                driver={order.driver}
            />
        </div>
    );
};

export default OrderDetails;
