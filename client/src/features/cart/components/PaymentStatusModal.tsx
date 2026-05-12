import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentStatusModalProps {
    isOpen: boolean;
    status: 'success' | 'failed' | 'cancelled' | null;
    orderDetails?: {
        orderId?: string;
        amount?: number;
        paymentMethod?: string;
        estimatedTime?: string;
        address?: string;
        errorMessage?: string;
    };
    onClose: () => void;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({ isOpen, status, orderDetails, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen || !status) return null;

    const handleAction = () => {
        if (status === 'success') {
            navigate('/profile/orders');
        }
        onClose();
    };

    const content = {
        success: {
            icon: <CheckCircle className="h-16 w-16 text-success" />,
            title: 'Order Placed Successfully!',
            description: 'Your payment was successful and your order is being prepared.',
            buttonText: 'Track Order',
            buttonClass: 'bg-success hover:bg-green-700',
        },
        failed: {
            icon: <XCircle className="h-16 w-16 text-destructive" />,
            title: 'Payment Failed',
            description: orderDetails?.errorMessage || 'Something went wrong with your payment. Please try again or use another payment method.',
            buttonText: 'Try Again',
            buttonClass: 'bg-destructive hover:bg-destructive',
        },
        cancelled: {
            icon: <AlertCircle className="h-16 w-16 text-amber-500" />,
            title: 'Payment Cancelled',
            description: 'The payment process was cancelled before completion.',
            buttonText: 'Back to Cart',
            buttonClass: 'bg-amber-500 hover:bg-amber-600',
        },
    };

    const currentContent = content[status as keyof typeof content];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-background shadow-2xl"
                >
                    <div className="p-8 text-center sm:p-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                            className="mb-6 flex justify-center"
                        >
                            {currentContent.icon}
                        </motion.div>

                        <h3 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
                            {currentContent.title}
                        </h3>
                        <p className="mb-8 text-muted-foreground">
                            {currentContent.description}
                        </p>

                        {status === 'success' && orderDetails && (
                            <div className="mb-8 space-y-4 rounded-2xl bg-muted p-6 text-left">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order ID</p>
                                        <p className="font-semibold text-foreground">{orderDetails.orderId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estimated Delivery</p>
                                        <p className="font-semibold text-foreground">{orderDetails.estimatedTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery Address</p>
                                        <p className="text-sm font-semibold text-foreground">{orderDetails.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleAction}
                                className={`w-full cursor-pointer rounded-xl py-4 font-bold text-white transition-all shadow-lg active:scale-95 ${currentContent.buttonClass}`}
                            >
                                {currentContent.buttonText}
                            </button>
                            {status !== 'success' && (
                                <button
                                    onClick={onClose}
                                    className="w-full cursor-pointer rounded-xl bg-muted py-4 font-bold text-muted-foreground transition-all hover:bg-muted"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentStatusModal;
