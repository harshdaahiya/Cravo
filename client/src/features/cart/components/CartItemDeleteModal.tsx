import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { useCartActions } from '../hooks/use-cart-actions';
import { RootState } from '../../../store';

const CartItemDeleteModal: React.FC = () => {
    const { handleDeleteItemFromCart, handleCloseDeleteModal } = useCartActions();
    const { isDeleteModalOpen, modalProps } = useSelector((state: RootState) => state.ui.cart);

    const itemName = modalProps?.itemName;
    const itemId = modalProps?.itemId;

    return (
        <AnimatePresence>
            {isDeleteModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={handleCloseDeleteModal}
                    />

                    {/* Modal container */}
                    <motion.div
                        initial={{ y: 20, scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 20, scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl"
                    >
                        {/* Modal content */}
                        <div className="text-center">
                            <h3 className="text-text-main text-2xl font-bold">
                                Confirm Deletion
                            </h3>
                            <p className="text-text-secondary mt-4 text-sm">
                                Are you sure you want to delete{' '}
                                <span className="text-text-main font-semibold">{itemName}</span>{' '}
                                from your cart?
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                onClick={handleCloseDeleteModal}
                                className="text-text-secondary cursor-pointer rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => itemId && itemName && handleDeleteItemFromCart({ itemId, itemName })}
                                className="bg-primary hover:bg-yellow-600 cursor-pointer rounded-lg px-5 py-2 text-sm font-medium text-black transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartItemDeleteModal;
