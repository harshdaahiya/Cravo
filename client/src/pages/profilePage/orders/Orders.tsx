import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useOrderActions } from '../../../features/orders/hooks/use-order-actions';
import EmptyOrdersState from './components/EmptyOrdersState';
import OrderCard from './components/OrderCard';
import OrdersHeader from './components/OrdersHeader';
import OrdersLoading from './components/OrdersLoading';
import OrdersSearch from './components/OrdersSearch';
import OrdersTabs from './components/OrdersTabs';
import { RootState } from '../../../store';
import { IOrder } from '../../../types/domain-models';

const Orders: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const userOrders = useSelector((state: RootState) => state.orders?.userOrders || []);
    const isOrdersLoading = useSelector((state: RootState) => state.orders?.isOrdersLoading || false);

    const { handleCancelOrder } = useOrderActions();

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string; color: string; dotColor: string }> = {
            Preparing: {
                label: 'Preparing',
                color: 'bg-yellow-100 text-yellow-800',
                dotColor: 'bg-primary-hover',
            },
            'On the way': {
                label: 'On the way',
                color: 'bg-blue-100 text-blue-800',
                dotColor: 'bg-blue-500',
            },
            Delivered: {
                label: 'Delivered',
                color: 'bg-green-100 text-green-800',
                dotColor: 'bg-green-500',
            },
            Cancelled: {
                label: 'Cancelled',
                color: 'bg-red-100 text-red-800',
                dotColor: 'bg-red-500',
            },
        };
        // Fallback for different casing or unmapped statuses
        const statusKey = Object.keys(configs).find(k => k.toLowerCase() === status.toLowerCase()) || 'Preparing';
        return configs[statusKey];
    };

    const formatDate = (d: string) => {
        return new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatETA = (d: string) => {
        const eta = new Date(d);
        const diff = Math.ceil((eta.getTime() - Date.now()) / 60000);
        if (diff <= 0) return 'Any moment now';
        if (diff < 60) return `${diff} min`;
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    };

    const getUIStatus = (apiStatus: string) => {
        const statusMap: Record<string, string> = {
            Confirmed: 'preparing',
            Preparing: 'preparing',
            'Out for Delivery': 'on_the_way',
            Delivered: 'delivered',
            Cancelled: 'cancelled',
        };
        return statusMap[apiStatus] || 'preparing';
    };

    const transformedOrders = (userOrders as IOrder[]).map(order => {
        const product = order.orderItems[0]?.product;
        let restaurantName = 'Restaurant';
        let restaurantImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80';

        if (product && typeof product !== 'string') {
            // Try to get restaurant name from product.restaurant if populated (IRestaurant)
            const restaurant = product.restaurant;
            if (restaurant && typeof restaurant !== 'string' && 'name' in restaurant) {
                restaurantName = restaurant.name;
            }
            // Or if product itself has restaurantName (legacy/flattened)
            else if ('restaurantName' in product) {
                restaurantName = (product as any).restaurantName;
            }

            if (product.images && product.images.length > 0) {
                restaurantImage = product.images[0];
            }
        }

        const orderDate = new Date(order.createdAt);
        const estimatedDelivery = new Date(orderDate.getTime() + 35 * 60000);

        const uiStatus = getUIStatus(order.orderStatus);
        const isActive = ['preparing', 'on_the_way'].includes(uiStatus);

        return {
            id: order._id,
            orderId: order._id.slice(-8).toUpperCase(),
            razorpayOrderId: order.razorpayOrderId,
            restaurant: {
                name: restaurantName,
                image: restaurantImage,
            },
            orderDate: order.createdAt,
            status: uiStatus,
            estimatedDelivery: isActive ? estimatedDelivery.toISOString() : null,
            items: order.orderItems.map(item => {
                let itemImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80';
                if (item.product && typeof item.product !== 'string' && item.product.images?.length) {
                    itemImage = item.product.images[0];
                }

                return {
                    id: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: itemImage,
                    customizations: item.customizations || [],
                };
            }),
            subtotal: order.subTotal,
            deliveryFee: order.shippingCost,
            tax: order.taxAmount,
            discount: order.discountApplied,
            total: order.totalAmount,
            deliveryAddress: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zipCode}`,
            deliveryInstructions: null,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            cancellationReason: order.cancellationReason || null,
            canReorder: true,
            canCancel: isActive && order.paymentStatus === 'Paid',
            driver: order.driver || null,
        };
    });

    const filteredOrders = transformedOrders.filter(o => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            o.orderId.toLowerCase().includes(term) ||
            o.razorpayOrderId?.toLowerCase().includes(term) ||
            o.restaurant.name.toLowerCase().includes(term) ||
            o.items.some(it => it.name.toLowerCase().includes(term));

        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'active' &&
                ['preparing', 'on_the_way'].includes(o.status)) ||
            (activeTab === 'completed' && o.status === 'delivered') ||
            (activeTab === 'cancelled' && o.status === 'cancelled');

        return matchesSearch && matchesTab;
    });

    const tabCounts = {
        all: transformedOrders.length,
        active: transformedOrders.filter(o =>
            ['preparing', 'on_the_way'].includes(o.status)
        ).length,
        completed: transformedOrders.filter(o => o.status === 'delivered').length,
        cancelled: transformedOrders.filter(o => o.status === 'cancelled').length,
    };

    const handleReorder = (order: any) => {
        console.log('Reorder:', order.id);
        // Implement reorder logic
    };

    const handleCancelOrderClick = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            console.log('Cancel order:', id);
            handleCancelOrder(id);
        }
    };

    const handleTrackOrder = (o: any) => {
        console.log('Track:', o.id);
        // Navigate to tracking page
    };

    if (isOrdersLoading) {
        return <OrdersLoading />;
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <OrdersHeader ordersCount={filteredOrders.length} />

            <OrdersTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={tabCounts}
            />

            <OrdersSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="space-y-4">
                {filteredOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        status={getStatusConfig(order.status)}
                        isExpanded={expandedOrder === order.id}
                        onToggleExpand={() =>
                            setExpandedOrder(expandedOrder === order.id ? null : order.id)
                        }
                        onReorder={handleReorder}
                        onCancel={handleCancelOrderClick}
                        onTrack={handleTrackOrder}
                        formatDate={formatDate}
                        formatETA={formatETA}
                    />
                ))}

                {filteredOrders.length === 0 && (
                    <EmptyOrdersState
                        hasFilters={activeTab !== 'all'}
                        searchTerm={searchTerm}
                    />
                )}
            </div>
        </div>
    );
};

export default Orders;
