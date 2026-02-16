import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { closeWishlistModal } from '../../ui/store/ui-slice';
import { selectDefaultProductListId } from '../store/wishlist-selectors';
import { useWishlistActions } from '../hooks/use-wishlist-actions';
import Icon from '../../../components/ui/Icon';
import { RootState, AppDispatch } from '../../../store';

const WishlistModal: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { lists, handleCreateWishlist, handleTransferProductFromList } = useWishlistActions();

    const { isWishlistModalOpen: isOpen, modalProps } = useSelector(
        (state: RootState) => state.ui.wishlist
    );

    const defaultListId = useSelector(selectDefaultProductListId);

    const [isCreatingNewList, setIsCreatingNewList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [selectedListId, setSelectedListId] = useState<string | undefined>(defaultListId);
    const [isTransferring, setIsTransferring] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (modalProps && modalProps.sourceListId) {
                setSelectedListId(modalProps.sourceListId);
            } else {
                setSelectedListId(defaultListId);
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, defaultListId, modalProps]);

    const handleCreateListClick = () => {
        if (newListName.trim()) {
            handleCreateWishlist({ name: newListName });
            setNewListName('');
            setIsCreatingNewList(false);
        }
    };

    const handleMoveProductClick = async () => {
        setIsTransferring(true);
        if (selectedListId && selectedListId !== defaultListId) {
            try {
                if (modalProps?.productId && modalProps?.sourceListId) {
                    await handleTransferProductFromList({
                        productId: modalProps.productId,
                        sourceListId: modalProps.sourceListId,
                        destinationListId: selectedListId,
                    });
                }
            } finally {
                setIsTransferring(false);
            }
        } else {
            setIsTransferring(false);
        }
    };

    const renderContent = () => {
        return (
            <>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-text-main text-xl font-bold">Your Wishlists</h2>
                    <button
                        onClick={() => dispatch(closeWishlistModal())}
                        className="hover:text-text-main cursor-pointer text-gray-400 transition-colors duration-200"
                        aria-label="Close"
                    >
                        <Icon name="x-circle" className="h-5 w-5" />
                    </button>
                </div>

                {/* Existing Lists */}
                <div className="custom-scrollbar mb-4 flex-grow overflow-y-auto">
                    <h3 className="text-text-main mb-2 text-sm font-semibold">
                        Select a list to move the product to
                    </h3>
                    <div className="space-y-2">
                        {lists.map(
                            list =>
                                list.list_type === 'productList' && (
                                    <button
                                        key={list._id}
                                        onClick={() => setSelectedListId(list._id)}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left shadow-sm transition-all duration-200 ${selectedListId === list._id
                                            ? 'bg-primary text-text-main shadow-md'
                                            : 'hover:bg-bg-subtle bg-white border border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Icon
                                                name={
                                                    list.list_type === 'productList'
                                                        ? 'shopping-bag'
                                                        : 'coffee'
                                                }
                                                className="h-4 w-4"
                                            />
                                            <span className="line-clamp-1 text-sm font-medium">
                                                {list.name}
                                            </span>
                                        </div>
                                        {/* @ts-ignore - items might be products or restaurants depending on list_type */}
                                        <span className="text-xs">{list.products?.length || 0}</span>
                                    </button>
                                )
                        )}
                    </div>
                </div>

                {/* Create New List Section */}
                <div className="border-border border-t pt-4">
                    {!isCreatingNewList ? (
                        <button
                            onClick={() => setIsCreatingNewList(true)}
                            className="text-text-main flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-gray-200 py-2 text-sm font-semibold transition-colors hover:bg-gray-300"
                        >
                            <Icon name="plus" className="h-4 w-4" />
                            <span>Create New List</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                                placeholder="New list name"
                                className="flex-grow rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === 'Enter') handleCreateListClick();
                                }}
                                autoFocus
                            />
                            <button
                                disabled={newListName === ''}
                                onClick={handleCreateListClick}
                                className="bg-primary text-text-main hover:bg-primary-hover rounded-full p-2 transition-colors cursor-pointer disabled:bg-gray-300"
                            >
                                <Icon name="check" className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleMoveProductClick}
                    className={`mt-4 w-full cursor-pointer rounded-lg py-2 text-center text-sm font-semibold transition-colors ${selectedListId === defaultListId
                        ? 'text-text-secondary cursor-not-allowed bg-gray-400'
                        : 'bg-primary text-text-main hover:bg-primary-hover'
                        }`}
                    disabled={selectedListId === defaultListId || isTransferring}
                >
                    {isTransferring
                        ? 'Adding product in selected list...'
                        : 'Move to Selected List'}
                </button>
            </>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-end p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gray-200 opacity-20"
                        onClick={() => dispatch(closeWishlistModal())}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4 }}
                        className="relative flex h-full w-full max-w-sm flex-col rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        {renderContent()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WishlistModal;
