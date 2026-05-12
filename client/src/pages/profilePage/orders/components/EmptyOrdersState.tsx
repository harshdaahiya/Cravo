import React from 'react';
import { Package } from 'lucide-react';

interface EmptyOrdersStateProps {
    hasFilters: boolean;
    searchTerm: string;
}

const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({ hasFilters, searchTerm }) => {
    return (
        <div className="border-border rounded-2xl border bg-background p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">No orders found</h3>
            <p className="text-text-secondary">
                {searchTerm || hasFilters
                    ? 'Try adjusting your search or filters'
                    : "You haven't placed any orders yet"}
            </p>
        </div>
    );
};

export default EmptyOrdersState;
