import React, { useState } from 'react';

import Icon from '../../../components/ui/Icon';

interface OrderSummarySectionProps {
    promoCode: string;
    setPromoCode: (code: string) => void;
    appliedPromo: {
        code: string;
        discount: number;
        type: 'percentage' | 'fixed';
        minOrder: number;
        description: string;
    } | null;
    applyPromoCode: () => void;
    removePromoCode: () => void;
    promoMessage: string;
    subtotal: number;
    itemDiscount: number;
    promoDiscount: number;
    deliveryFee: number;
    serviceFee: number;
    gst: number;
    finalTotal: number;
    handleCheckout: () => void;
    isCheckoutLoading: boolean;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
    promoCode,
    setPromoCode,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    promoMessage,
    subtotal,
    itemDiscount,
    promoDiscount,
    deliveryFee,
    serviceFee,
    gst,
    finalTotal,
    handleCheckout,
}) => {
    const [isNoContactSelected, setIsNoContactSelected] = useState(false);

    return (
        <div className="space-y-4 rounded-3xl bg-background p-4 shadow-lg">
            {/* Promo Code Input */}
            <div>
                <h2 className="text-foreground mb-3 text-xl font-bold">Promo Code</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="border-border flex-grow rounded-xl border p-3 transition-all focus:ring-2 focus:ring-ring focus:outline-none"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                    />
                    {appliedPromo ? (
                        <button
                            onClick={removePromoCode}
                            className="rounded-xl bg-destructive px-4 py-3 font-semibold text-white transition-colors hover:bg-destructive"
                        >
                            Remove
                        </button>
                    ) : (
                        <button
                            onClick={applyPromoCode}
                            className="bg-primary hover:bg-primary-hover text-foreground rounded-xl px-4 py-3 font-semibold transition-colors"
                        >
                            Apply
                        </button>
                    )}
                </div>
                {promoMessage && (
                    <p
                        className={`mt-2 text-sm font-medium ${appliedPromo ? 'text-success' : 'text-destructive'}`}
                    >
                        {promoMessage}
                    </p>
                )}
            </div>

            {/* Order Summary */}
            <div className="space-y-3">
                <h2 className="text-foreground text-xl font-bold">Order Summary</h2>
                <div className="text-text-secondary space-y-2 font-medium">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="flex items-center">
                            <Icon name="indian-rupee" className="h-3 w-3" />
                            {subtotal.toFixed(2)}
                        </span>
                    </div>
                    {itemDiscount > 0 && (
                        <div className="flex justify-between text-success">
                            <span>Item Discount</span>
                            <span className="flex items-center">
                                -<Icon name="indian-rupee" className="h-3 w-3" />
                                {itemDiscount.toFixed(2)}
                            </span>
                        </div>
                    )}
                    {promoDiscount > 0 && (
                        <div className="flex justify-between text-success">
                            <span>Promo Discount</span>
                            <span className="flex items-center">
                                -<Icon name="indian-rupee" className="mr-1 h-4 w-4" />
                                {promoDiscount.toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="flex items-center">
                            {deliveryFee === 0 ? (
                                'Free'
                            ) : (
                                <>
                                    <Icon name="indian-rupee" className="h-3 w-3" />
                                    {deliveryFee.toFixed(2)}
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Service Fee</span>
                        <span className="flex items-center">
                            <Icon name="indian-rupee" className="h-3 w-3" />
                            {serviceFee.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes & GST</span>
                        <span className="flex items-center">
                            <Icon name="indian-rupee" className="h-3 w-3" />
                            {gst.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="h-px bg-muted" />

                {/* No-contact delivery option */}
                <div className="flex items-start space-x-2">
                    <input
                        type="checkbox"
                        id="no-contact-checkbox"
                        checked={isNoContactSelected}
                        onChange={e => setIsNoContactSelected(e.target.checked)}
                        className="mt-1 h-7 w-7 accent-yellow-400 focus:ring-ring"
                    />
                    <label
                        htmlFor="no-contact-checkbox"
                        className="text-text-secondary text-sm font-medium"
                    >
                        {isNoContactSelected
                            ? 'Our delivery partner will call to confirm. Please ensure that your address has all the required details.'
                            : 'Opt in for No-contact Delivery. Unwell, or avoiding contact? Partner will safely place the order outside your door (not for COD).'}
                    </label>
                </div>

                <div className="h-px bg-muted" />

                <div className="text-foreground flex justify-between text-lg font-bold">
                    <span>Final Total</span>
                    <div className="flex items-center">
                        <Icon name="indian-rupee" className="h-4 w-4" />
                        {finalTotal.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <div>
                <button
                    onClick={handleCheckout}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-success px-6 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-success"
                >
                    <Icon name="indian-rupee" className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default OrderSummarySection;
