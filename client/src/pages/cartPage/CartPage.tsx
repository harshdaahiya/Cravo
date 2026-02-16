import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    CartItemDeleteModal,
    PaymentStatusModal,
    CartItemsSection,
    CartNavigation,
    DeliveryAddressSection,
    DeliveryInstructionsSection,
    OrderSummarySection,
    PaymentMethodSection,
    selectCartTotalValue,
    PaymentMethod
} from '../../features/cart';
import Icon from '../../components/ui/Icon';
import { useOrderActions } from '../../features/orders/hooks/use-order-actions';
import { RootState } from '../../store';

const CartPage: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const cartItems = cart.items;

    // Check authentication status
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // addresses of the user
    const userAddresses = useSelector((state: RootState) => state.address);

    const { isDeleteModalOpen } = useSelector((state: RootState) => state.ui.cart);

    const addresses = userAddresses.list;

    const paymentMethods: PaymentMethod[] = [
        {
            id: 1,
            type: 'Credit Card',
            details: 'Visa ending in 4242',
            icon: 'credit-card',
            isDefault: false,
        },
        {
            id: 2,
            type: 'UPI',
            details: 'Visa ending in 4242',
            icon: 'bank-note',
            isDefault: true,
        },
        {
            id: 3,
            type: 'Debit Card',
            details: 'john.doe@email.com',
            icon: 'credit-card',
            isDefault: false,
        },
        {
            id: 4,
            type: 'COD',
            details: 'john.doe@email.com',
            icon: 'bank-note',
            isDefault: false,
        },
        {
            id: 5,
            type: 'Wallet',
            details: 'john.doe@email.com',
            icon: 'wallet',
            isDefault: false,
        },
    ];

    const promoCodes = [
        {
            code: 'SAVE20',
            discount: 20,
            type: 'percentage' as const,
            minOrder: 25,
            description: '20% off on orders above $25',
        },
        {
            code: 'FLAT10',
            discount: 10,
            type: 'fixed' as const,
            minOrder: 30,
            description: '$10 off on orders above $30',
        },
    ];

    const [selectedAddress, setSelectedAddress] = useState<string | null>(
        addresses.find(addr => addr.isDefault)?._id || (addresses.length > 0 ? addresses[0]._id : null)
    );

    const [selectedPayment, setSelectedPayment] = useState<number | null>(
        paymentMethods.find(pm => pm.isDefault)?.id || null
    );

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[0] | null>(null);
    const [promoMessage, setPromoMessage] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    // Payment Status Modal State
    const [paymentModalState, setPaymentModalState] = useState<{
        isOpen: boolean;
        status: 'success' | 'failed' | 'cancelled' | null;
        orderDetails: any;
    }>({
        isOpen: false,
        status: null,
        orderDetails: null,
    });

    // Use selectors to get the subtotal and total value from the cart items
    const subtotal = useSelector(selectCartTotalValue);

    // Calculations for order summary
    const originalTotal = cartItems.reduce(
        (sum, item) =>
            sum + (item.product.price + (item.product.promotionalDiscount?.value || 0)) * item.quantity,
        0
    );
    const itemDiscount = originalTotal - subtotal;
    const deliveryFee = subtotal >= 35 ? 0 : 3.99;
    const serviceFee = 2.5;
    const gst = subtotal * 0.08;

    let promoDiscount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            promoDiscount = (subtotal * appliedPromo.discount) / 100;
        } else {
            promoDiscount = appliedPromo.discount;
        }
    }

    const finalTotal = subtotal + deliveryFee + serviceFee + gst - promoDiscount;

    const applyPromoCode = () => {
        const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
        setPromoMessage('');
        if (promo) {
            if (subtotal >= promo.minOrder) {
                setAppliedPromo(promo);
                setPromoCode('');
                setPromoMessage('Promo code applied successfully!');
            } else {
                setPromoMessage(`Minimum order of $${promo.minOrder} required.`);
            }
        } else {
            setPromoMessage('Invalid promo code.');
        }
    };

    const removePromoCode = () => {
        setAppliedPromo(null);
        setPromoMessage('');
    };

    const { handleClearOrderState, handleCreateOrder, handleVerifyPayment } =
        useOrderActions();

    const selectedAddressDetails =
        addresses.find(addr => addr._id === selectedAddress) || null;

    const selectedPaymentDetails =
        paymentMethods.find(pm => pm.id === selectedPayment) || null;

    const handleRazorpaySuccess = async (response: any) => {
        const verificationPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
        };

        try {
            await handleVerifyPayment(verificationPayload);

            setIsCheckoutLoading(false);

            setPaymentModalState({
                isOpen: true,
                status: 'success',
                orderDetails: {
                    orderId: response.razorpay_order_id,
                    amount: finalTotal,
                    paymentMethod: selectedPaymentDetails?.type,
                    estimatedTime: '30-40 mins',
                    address: selectedAddressDetails ? `${selectedAddressDetails.addressLine1}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state}` : 'N/A',
                },
            });
        } catch (error) {
            console.error('Payment verification failed:', error);
            setIsCheckoutLoading(false);

            setPaymentModalState({
                isOpen: true,
                status: 'failed',
                orderDetails: {
                    amount: finalTotal,
                    paymentMethod: selectedPaymentDetails?.type,
                    errorMessage: 'Payment verification failed. Please contact support.',
                },
            });
        }
    };

    const displayRazorpay = (razorpayDetails: any) => {
        const { amount, razorpayOrderId, keyId } = razorpayDetails;

        const options = {
            key: keyId,
            amount: amount,
            currency: razorpayDetails.currency || 'INR',
            name: 'Cravo India Limited',
            order_id: razorpayOrderId,
            handler: handleRazorpaySuccess,
            prefill: {
                /* ... user details ... */
            },
            theme: { color: '#FBBF24' },
            modal: {
                ondismiss: function () {
                    console.log('Payment modal closed by user');
                    setIsCheckoutLoading(false);

                    setPaymentModalState({
                        isOpen: true,
                        status: 'cancelled',
                        orderDetails: {
                            amount: finalTotal,
                            paymentMethod: selectedPaymentDetails?.type,
                        },
                    });
                },
            },
        };

        const win = window as any;
        if (win.Razorpay) {
            const rzp1 = new win.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                console.error('Razorpay Error:', response.error);
                setIsCheckoutLoading(false);

                setPaymentModalState({
                    isOpen: true,
                    status: 'failed',
                    orderDetails: {
                        amount: finalTotal,
                        paymentMethod: selectedPaymentDetails?.type,
                        errorMessage:
                            response.error.description ||
                            'Payment processing failed. Please try again.',
                    },
                });

                handleClearOrderState();
            });
            rzp1.open();
        } else {
            alert('Payment gateway failed to load.');
            handleClearOrderState();
            setIsCheckoutLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!selectedAddressDetails || !selectedPaymentDetails) {
            alert('Please select an address and payment method.');
            return;
        }

        setIsCheckoutLoading(true);
        handleClearOrderState();

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            alert('Payment script could not load. Check your internet connection.');
            setIsCheckoutLoading(false);
            return;
        }

        const orderPayload = {
            deliveryAddress: {
                street: `${selectedAddressDetails.addressLine1}${selectedAddressDetails.addressLine2 || ''}`,
                city: selectedAddressDetails.city,
                state: selectedAddressDetails.state,
                zipCode: selectedAddressDetails.zipCode,
                country: selectedAddressDetails.country,
            },
            paymentMethod: selectedPaymentDetails.type as any,
            deliveryMethod: 'Standard',
            promoCode: 'SAVE50',
            guestInfo: {
                name: 'my guest',
                email: 'myguest@gmail.com',
            },
        };

        try {
            const result = await handleCreateOrder(orderPayload).unwrap();
            displayRazorpay(result);
        } catch (error) {
            console.error('Order Creation Failed:', error);
            setIsCheckoutLoading(false);
            setPaymentModalState({
                isOpen: true,
                status: 'failed',
                orderDetails: {
                    amount: finalTotal,
                    paymentMethod: selectedPaymentDetails?.type,
                    errorMessage: 'Failed to create order. Please try again.',
                },
            });
        }
    };

    const closePaymentModal = () => {
        setPaymentModalState({
            isOpen: false,
            status: null,
            orderDetails: null,
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center font-sans">
                <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
                        <Icon name="user" className="h-12 w-12 text-yellow-500" />
                    </div>
                    <h2 className="text-text-main mb-4 text-2xl font-bold">
                        Login Required
                    </h2>
                    <p className="text-text-secondary mb-8">
                        We are working on guest checkout. Please login to order food!
                    </p>
                    <Link to={'/login'}>
                        <button className="bg-primary hover:bg-primary-hover text-text-main cursor-pointer rounded-full px-8 py-3 font-semibold shadow-lg transition-all">
                            Login to Continue
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center font-sans">
                <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
                        <Icon name="shopping-cart" className="h-12 w-12 text-yellow-500" />
                    </div>
                    <h2 className="text-text-main mb-4 text-2xl font-bold">
                        Your cart is empty
                    </h2>
                    <p className="text-text-secondary mb-8">
                        Start adding delicious items to your order!
                    </p>
                    <Link to={'/restaurants'}>
                        <button className="bg-primary hover:bg-primary-hover text-text-main cursor-pointer rounded-full px-8 py-3 font-semibold shadow-lg transition-all">
                            Browse Restaurants
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-bg-subtle min-h-screen font-sans">
                <CartNavigation />
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column (Items, Delivery & Payment) */}
                        <div className="space-y-4 lg:col-span-2">
                            <CartItemsSection cartItems={cartItems} />
                            <DeliveryAddressSection
                                addresses={addresses}
                                selectedAddress={selectedAddress}
                                setSelectedAddress={setSelectedAddress}
                            />
                            <PaymentMethodSection
                                paymentMethods={paymentMethods}
                                selectedPayment={selectedPayment}
                                setSelectedPayment={setSelectedPayment}
                            />
                            <DeliveryInstructionsSection
                                deliveryInstructions={deliveryInstructions}
                                setDeliveryInstructions={setDeliveryInstructions}
                            />
                        </div>

                        {/* Right Column (Order Summary) */}
                        <div className="lg:col-span-1">
                            <OrderSummarySection
                                promoCode={promoCode}
                                setPromoCode={setPromoCode}
                                appliedPromo={appliedPromo}
                                applyPromoCode={applyPromoCode}
                                removePromoCode={removePromoCode}
                                promoMessage={promoMessage}
                                subtotal={subtotal}
                                itemDiscount={itemDiscount}
                                promoDiscount={promoDiscount}
                                deliveryFee={deliveryFee}
                                serviceFee={serviceFee}
                                gst={gst}
                                finalTotal={finalTotal}
                                handleCheckout={handleCheckout}
                                isCheckoutLoading={isCheckoutLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && <CartItemDeleteModal />}

            {/* Payment Status Modal */}
            <PaymentStatusModal
                isOpen={paymentModalState.isOpen}
                status={paymentModalState.status}
                orderDetails={paymentModalState.orderDetails}
                onClose={closePaymentModal}
            />

            {/* Loading Overlay */}
            {isCheckoutLoading && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
                    <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
                        <div className="border-border-focus mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
                        <h3 className="text-text-main mb-2 text-xl font-semibold">
                            Processing Payment
                        </h3>
                        <p className="text-text-secondary">
                            Please wait while we prepare your order...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartPage;
