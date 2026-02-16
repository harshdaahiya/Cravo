import React from 'react';
import {
    ChevronDown,
    ChevronUp,
    Navigation,
    ShoppingCart,
    XCircle,
} from 'lucide-react';

interface OrderSummaryProps {
    order: {
        id: string;
        orderId: string;
        restaurant: {
            name: string;
            image: string;
        };
        orderDate: string;
        status: string;
        estimatedDelivery?: string | null;
        total: number;
        items: any[];
        paymentStatus: string;
        canReorder: boolean;
        canCancel: boolean;
        cancellationReason?: string | null;
    };
    status: {
        label: string;
        color: string;
        dotColor: string;
    };
    onReorder: (order: any) => void;
    onCancel: (id: string) => void;
    onTrack: (order: any) => void;
    onToggleExpand: () => void;
    isExpanded: boolean;
    formatDate: (date: string) => string;
    formatETA: (eta: string) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    order,
    status,
    onReorder,
    onCancel,
    onTrack,
    onToggleExpand,
    isExpanded,
    formatDate,
    formatETA,
}) => {
    return (
        <div className="p-6">
            <div className="flex items-start gap-4">
                <img
                    src={order.restaurant.image}
                    alt={order.restaurant.name}
                    className="h-20 w-20 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-text-main text-lg font-bold">
                                {order.restaurant.name}
                            </h3>
                            <p className="text-text-muted mt-0.5 text-sm">
                                {formatDate(order.orderDate)}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Order ID: {order.orderId}
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`}
                                    ></span>
                                    {status.label}
                                </span>

                                {order.estimatedDelivery && order.status !== 'delivered' && (
                                    <span className="text-xs font-medium text-yellow-600">
                                        ETA: {formatETA(order.estimatedDelivery)}
                                    </span>
                                )}
                            </div>

                            {order.status === 'cancelled' && order.cancellationReason && (
                                <p className="mt-2 text-xs text-red-600">
                                    Reason: {order.cancellationReason}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-text-main text-xl font-bold">
                                ₹{order.total.toFixed(2)}
                            </p>
                            <p className="text-text-muted mt-1 text-sm">
                                {order.items.length} items
                            </p>
                            <p className="mt-1 text-xs font-medium text-green-600">
                                {order.paymentStatus}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {order.canReorder && (
                            <button
                                onClick={() => onReorder(order)}
                                className="bg-primary hover:bg-primary-hover text-text-main inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Reorder
                            </button>
                        )}

                        {['preparing', 'on_the_way'].includes(order.status) &&
                            order.canCancel && (
                                <button
                                    onClick={() => onCancel(order.id)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancel
                                </button>
                            )}

                        {['preparing', 'on_the_way'].includes(order.status) && (
                            <button
                                onClick={() => onTrack(order)}
                                className="text-text-main inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-200"
                            >
                                <Navigation className="h-4 w-4" />
                                Track
                            </button>
                        )}

                        <button
                            onClick={onToggleExpand}
                            className="text-text-main inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-200"
                        >
                            {isExpanded ? 'Hide' : 'View'} Details
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
