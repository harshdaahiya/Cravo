import React from 'react';

import Icon, { IconName } from '../../../components/ui/Icon';

export interface PaymentMethod {
    id: number;
    type: string;
    details: string;
    icon: IconName;
    isDefault: boolean;
}

interface PaymentMethodCardProps {
    payment: PaymentMethod;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ payment, isSelected, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(payment.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${isSelected
                ? 'border-border-focus bg-warning-muted text-warning-foreground'
                : 'bg-muted text-text-secondary border-border hover:bg-muted'
                }`}
        >
            <Icon name={payment.icon} className="h-4 w-4" />
            {payment.type}
        </button>
    );
};

export default PaymentMethodCard;
