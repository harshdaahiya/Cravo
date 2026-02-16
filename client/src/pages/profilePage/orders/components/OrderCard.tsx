import React from 'react';

import OrderDetails from '../sections/OrderDetails';
import OrderSummary from '../sections/OrderSummary';

interface OrderCardProps {
    order: any;
    status: {
        label: string;
        color: string;
        dotColor: string;
    };
    isExpanded: boolean;
    onToggleExpand: () => void;
    onReorder: (order: any) => void;
    onCancel: (id: string) => void;
    onTrack: (order: any) => void;
    formatDate: (date: string) => string;
    formatETA: (eta: string) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({
    order,
    status,
    isExpanded,
    onToggleExpand,
    onReorder,
    onCancel,
    onTrack,
    formatDate,
    formatETA,
}) => {
    return (
        <div className="border-border overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-lg">
            <OrderSummary
                order={order}
                status={status}
                onReorder={onReorder}
                onCancel={onCancel}
                onTrack={onTrack}
                onToggleExpand={onToggleExpand}
                isExpanded={isExpanded}
                formatDate={formatDate}
                formatETA={formatETA}
            />

            {isExpanded && <OrderDetails order={order} />}
        </div>
    );
};

export default OrderCard;
