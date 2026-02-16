import React, { useState } from 'react';

import Icon from '../../../components/ui/Icon';
import { useWishlistActions } from '../../../features/wishlist/hooks/use-wishlist-actions';
import ItemsView from './sections/ItemsView';
import WishlistSelectionView from './sections/WishlistSelectionView';
import { IWishlist } from '../../../types/domain-models';

const FavoritesPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedListId, setSelectedListId] = useState<string | null>(null);

    const { lists } = useWishlistActions();

    const selectedList = lists.find((list: IWishlist) => list._id === selectedListId);

    return (
        <div className="bg-cream min-h-screen py-2">
            <div className="mx-auto max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-mint-green/20 flex h-16 w-16 items-center justify-center rounded-full">
                            <Icon name="heart" className="text-mint-green h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-text-main mb-2 text-4xl font-bold">
                                {selectedList ? `Items in "${selectedList.name}"` : 'My Favorites'}
                            </h1>
                        </div>
                    </div>
                    {selectedListId && (
                        <button
                            onClick={() => setSelectedListId(null)}
                            className="text-charcoal flex cursor-pointer items-center gap-2 font-medium transition-colors hover:text-yellow-400"
                        >
                            <Icon name="arrow-left" className="h-5 w-5" /> Back to lists
                        </button>
                    )}
                </header>

                {selectedListId && selectedList ? (
                    <ItemsView
                        selectedList={selectedList}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                ) : (
                    <WishlistSelectionView
                        wishlists={lists}
                        setSelectedListId={setSelectedListId}
                    />
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
