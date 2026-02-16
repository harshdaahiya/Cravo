import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

interface DeliveryInfoProps {
    address: string;
    instructions?: string | null;
    driver?: {
        name: string;
        phone: string;
    } | null;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ address, instructions, driver }) => {
    return (
        <div className="space-y-3 rounded-lg bg-white p-4">
            <h4 className="text-text-main mb-3 font-semibold">
                Delivery Information
            </h4>
            <div className="text-text-secondary flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                <span>{address}</span>
            </div>
            {instructions && (
                <div className="text-text-secondary flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>{instructions}</span>
                </div>
            )}
            {driver && (
                <div className="text-text-secondary flex items-start gap-3 text-sm">
                    <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>
                        {driver.name} • {driver.phone}
                    </span>
                </div>
            )}
        </div>
    );
};

export default DeliveryInfo;
