import React, { useState } from 'react';
import {
    ChevronRight,
    Coffee,
    Heart,
    Plus,
    ShoppingBag,
    Star,
} from 'lucide-react';

import { useWishlistActions } from '../../../../features/wishlist/hooks/use-wishlist-actions';
import { IWishlist } from '../../../../types/domain-models';

interface WishlistSelectionViewProps {
    wishlists: IWishlist[];
    setSelectedListId: (id: string | null) => void;
}

const WishlistSelectionView: React.FC<WishlistSelectionViewProps> = ({ wishlists, setSelectedListId }) => {
    const [showNewListInput, setShowNewListInput] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListType, setNewListType] = useState<'productList' | 'restaurantList'>('productList');

    const { handleCreateWishlist } = useWishlistActions();

    const handleSave = () => {
        if (newListName.trim()) {
            handleCreateWishlist({
                name: newListName,
                // Assuming the hook handles the type or we need to update it
            });

            setNewListName('');
            setNewListType('productList');
            setShowNewListInput(false);
        }
    };

    const getListIcon = (listType: string) => {
        switch (listType) {
            case 'productList':
                return ShoppingBag;
            case 'restaurantList':
                return Coffee;
            default:
                return Heart;
        }
    };

    const getGradientClass = (index: number) => {
        const gradients = [
            'from-yellow-50 to-amber-100',
            'from-green-50 to-emerald-100',
            'from-orange-50 to-yellow-100',
            'from-amber-50 to-orange-100',
            'from-lime-50 to-green-100',
            'from-yellow-50 to-orange-100',
        ];
        return gradients[index % gradients.length];
    };

    if (!wishlists || wishlists.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-amber-100 shadow-lg">
                    <Heart className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-text-main mb-3 text-2xl font-bold">
                    No Wishlists Yet
                </h3>
                <p className="text-text-secondary mb-8 max-w-md leading-relaxed">
                    Create your first wishlist to start organizing your favorite items and
                    discover new possibilities.
                </p>
                <button
                    onClick={() => setShowNewListInput(true)}
                    className="group bg-primary text-text-main inline-flex transform cursor-pointer items-center gap-3 rounded-2xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl"
                >
                    <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                    Create Your First List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-text-main mb-2 text-4xl font-bold">
                        My Wishlists
                    </h1>
                    <p className="text-text-secondary">
                        Organize and manage your favorite collections
                    </p>
                </div>
                {!showNewListInput && (
                    <button
                        onClick={() => setShowNewListInput(true)}
                        className="group bg-primary text-text-main inline-flex transform cursor-pointer items-center gap-3 self-start rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl"
                    >
                        <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                        Create New List
                    </button>
                )}
            </div>

            {/* New List Input */}
            {showNewListInput && (
                <div className="animate-in slide-in-from-top-4 transform rounded-2xl border border-yellow-100 bg-white p-6 shadow-xl duration-300">
                    <div className="bg-bg-subtle mb-6 flex items-center space-x-4 rounded-xl p-2 shadow-inner">
                        <button
                            onClick={() => setNewListType('productList')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-200 ${newListType === 'productList'
                                    ? 'bg-primary text-text-main shadow-md'
                                    : 'text-text-secondary hover:bg-gray-100'
                                }`}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Product List
                        </button>
                        <button
                            onClick={() => setNewListType('restaurantList')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-200 ${newListType === 'restaurantList'
                                    ? 'bg-primary text-text-main shadow-md'
                                    : 'text-text-secondary hover:bg-gray-100'
                                }`}
                        >
                            <Coffee className="h-5 w-5" />
                            Restaurant List
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                placeholder={`Enter name for your new ${newListType.replace('List', '').toLowerCase()} list...`}
                                className="text-text-main focus:border-border-focus w-full rounded-xl border border-yellow-200 bg-yellow-50 px-6 py-4 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!newListName.trim()}
                                className="transform rounded-xl bg-green-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewListInput(false);
                                    setNewListName('');
                                }}
                                className="text-text-main transform rounded-xl bg-yellow-100 px-6 py-4 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Wishlists Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {wishlists.map((list, index) => {
                    const IconComponent = getListIcon(list.list_type);
                    const itemCount = (list.items?.length ?? (list.list_type === 'productList' ? list.products?.length : list.restaurants?.length)) || 0;

                    return (
                        <div
                            key={list._id}
                            onClick={() => setSelectedListId(list._id)}
                            className={`group relative bg-gradient-to-br ${getGradientClass(index)} transform cursor-pointer rounded-2xl border border-yellow-200/50 p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                            <div className="bg-primary/10 absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-200/30 bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                        <IconComponent
                                            className="text-brown h-7 w-7"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <ChevronRight className="text-text-muted group-hover:text-brown h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-text-main group-hover:text-text-main line-clamp-2 text-xl font-bold transition-colors duration-200">
                                        {list.name}
                                    </h3>

                                    <div className="flex items-center justify-between">
                                        <span className="text-brown inline-flex items-center gap-2 rounded-full border border-yellow-200/50 bg-white/70 px-3 py-1.5 text-sm font-medium capitalize backdrop-blur-sm">
                                            <Star
                                                className="h-3.5 w-3.5 text-yellow-500"
                                                fill="currentColor"
                                            />
                                            {list.list_type?.replace('List', '') || 'Custom'} List
                                        </span>

                                        <span className="text-text-main group-hover:text-text-main text-lg font-bold transition-colors duration-200">
                                            {itemCount}
                                            <span className="text-text-secondary ml-1 text-sm font-medium">
                                                {itemCount === 1 ? 'item' : 'items'}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-yellow-300/40 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-grow overflow-hidden rounded-full bg-yellow-200/40">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                                                style={{
                                                    width: `${Math.min((itemCount / 10) * 100, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-brown text-xs font-medium">
                                            {Math.min(itemCount, 10)}/10
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats Footer */}
            {wishlists.length > 0 && (
                <div className="mt-12 rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-6">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-center sm:text-left">
                            <p className="text-text-main text-2xl font-bold">
                                {wishlists.length}{' '}
                                {wishlists.length === 1 ? 'Wishlist' : 'Wishlists'}
                            </p>
                            <p className="text-text-secondary">
                                {wishlists.reduce(
                                    (total, list) =>
                                        total +
                                        ((list.items?.length ?? (list.list_type === 'productList' ? list.products?.length : (list.restaurants?.length || 0))) || 0),
                                    0
                                )}{' '}
                                total items saved
                            </p>
                        </div>
                        <div className="text-brown flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-400" fill="currentColor" />
                            <span className="text-sm font-medium">
                                Keep exploring and saving!
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistSelectionView;
