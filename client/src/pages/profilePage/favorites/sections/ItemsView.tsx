import React from 'react';

import Icon from '../../../../components/ui/Icon';
import ProductGridCard from '../components/ProductGridCard';
// import ProductListCard from '../components/ProductListCard';
import RestaurantGridCard from '../components/RestaurantGridCard';
// import RestaurantListCard from '../components/RestaurantListCard';
import { IWishlist, IProduct, IRestaurant } from '../../../../types/domain-models';

interface ItemsViewProps {
    selectedList: IWishlist;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const ItemsView: React.FC<ItemsViewProps> = ({ selectedList, viewMode, setViewMode }) => {
    const productListItems = selectedList.products || [];
    const restaurantListItems = selectedList.restaurants || [];

    // Determine the actual list of items based on the list_type
    const activeItems =
        selectedList.list_type === 'productList'
            ? productListItems
            : restaurantListItems;

    if (!activeItems || activeItems.length === 0) {
        return (
            <div className="text-text-muted p-8 text-center font-medium">
                This list is currently empty.
            </div>
        );
    }

    let CardComponent: any;
    if (viewMode === 'grid') {
        CardComponent =
            selectedList.list_type === 'productList'
                ? ProductGridCard
                : RestaurantGridCard;
    } else {
        // Falls back to Grid for now as List cards are not yet migrated or might not be needed
        CardComponent =
            selectedList.list_type === 'productList'
                ? ProductGridCard
                : RestaurantGridCard;
    }

    const listContainerClass =
        viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'; // 'space-y-10' ;

    return (
        <>
            <div className="border-cream flex items-center justify-between rounded-2xl border bg-white p-4 shadow-lg">
                <p className="text-medium-gray text-sm">
                    {selectedList.list_type === 'productList'
                        ? `Showing ${(selectedList.products?.length || 0)} items`
                        : `Showing ${(selectedList.restaurants?.length || 0)} restaurants`}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-mint-green text-white' : 'text-charcoal bg-gray-100 hover:bg-gray-200'}`}
                    >
                        <Icon name="grid" className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'bg-mint-green text-white' : 'text-charcoal bg-gray-100 hover:bg-gray-200'}`}
                    >
                        <Icon name="list" className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className={listContainerClass}>
                {selectedList.list_type === 'productList'
                    ? (selectedList.products as IProduct[]).map(item => (
                        <CardComponent
                            key={typeof item === 'string' ? item : item._id}
                            item={item}
                            listId={selectedList._id}
                        />
                    ))
                    : (selectedList.restaurants as IRestaurant[]).map(item => (
                        <CardComponent
                            key={typeof item === 'string' ? item : item._id}
                            item={item}
                            listId={selectedList._id}
                        />
                    ))}
            </div>
        </>
    );
};

export default ItemsView;
