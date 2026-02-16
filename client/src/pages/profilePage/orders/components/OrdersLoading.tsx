import React from 'react';

const OrdersLoading: React.FC = () => {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex h-64 items-center justify-center">
                <div className="border-border-focus h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
        </div>
    );
};

export default OrdersLoading;
