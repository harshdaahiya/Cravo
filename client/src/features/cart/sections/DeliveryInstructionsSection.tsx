import React from 'react';

interface DeliveryInstructionsSectionProps {
    deliveryInstructions: string;
    setDeliveryInstructions: (instructions: string) => void;
}

const DeliveryInstructionsSection: React.FC<DeliveryInstructionsSectionProps> = ({
    deliveryInstructions,
    setDeliveryInstructions,
}) => {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-lg">
            <h2 className="text-text-main mb-3 text-xl font-bold">
                Delivery Instructions
            </h2>
            <textarea
                className="border-border h-24 w-full rounded-xl border p-3 transition-all focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="e.g., Leave at the front door, don't ring bell"
                value={deliveryInstructions}
                onChange={e => setDeliveryInstructions(e.target.value)}
            />
        </div>
    );
};

export default DeliveryInstructionsSection;
