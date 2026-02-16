import React from 'react';

import PaymentMethodCard, { PaymentMethod } from '../components/PaymentMethodCard';

interface PaymentMethodSectionProps {
    paymentMethods: PaymentMethod[];
    selectedPayment: number | null;
    setSelectedPayment: (id: number) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
    paymentMethods,
    selectedPayment,
    setSelectedPayment,
}) => {
    return (
        <div className="rounded-2xl bg-white p-3 shadow-md">
            <h2 className="text-text-main mb-2 text-lg font-bold">Payment Method</h2>
            <div className="flex flex-wrap gap-2">
                {paymentMethods.map(payment => (
                    <PaymentMethodCard
                        key={payment.id}
                        payment={payment}
                        isSelected={selectedPayment === payment.id}
                        onSelect={setSelectedPayment}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSection;
