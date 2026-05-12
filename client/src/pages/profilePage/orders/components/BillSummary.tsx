import React from 'react';

interface BillSummaryProps {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
}

const BillSummary: React.FC<BillSummaryProps> = ({
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    paymentMethod,
}) => {
    return (
        <div className="rounded-lg bg-background p-4">
            <h4 className="text-foreground mb-3 font-semibold">Bill Summary</h4>
            <div className="space-y-2 text-sm">
                <div className="text-text-secondary flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="text-text-secondary flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="text-text-secondary flex justify-between">
                    <span>Tax & Charges</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-success">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="text-foreground border-border flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total Paid</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground mt-1 flex justify-between text-sm">
                    <span>Payment Method</span>
                    <span>{paymentMethod}</span>
                </div>
            </div>
        </div>
    );
};

export default BillSummary;
