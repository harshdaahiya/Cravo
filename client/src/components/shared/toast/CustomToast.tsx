import React from 'react';
import toast, { Toast } from 'react-hot-toast';

import Icon from '../../ui/Icon';

interface CustomToastProps {
    message: string;
    actionText?: string;
    onActionClick?: () => void;
    t: Toast;
    stackIndex?: number;
}

const CustomToast: React.FC<CustomToastProps> = ({
    message,
    actionText,
    onActionClick,
    t,
    stackIndex = 0,
}) => {
    const offset = stackIndex * 20;

    return (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } text-gray-900 border-gray-100 flex w-full max-w-sm items-center justify-between space-x-4 rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5`}
            style={{
                transform: `translateX(${-offset}px)`,
                transition: 'transform 0.3s ease-in-out',
            }}
        >
            {/* Icon for visual feedback */}
            <div className="flex-shrink-0">
                <Icon name="heart" className="h-6 w-6 text-red-500 fill-red-500" />
            </div>

            <div className="flex-grow pr-2 text-sm font-medium">
                <p className="line-clamp-2">{message}</p>
            </div>

            <div className="flex flex-shrink-0 items-center space-x-4">
                {actionText && (
                    <button
                        onClick={() => {
                            onActionClick?.();
                            toast.dismiss(t.id);
                        }}
                        className="cursor-pointer text-sm font-semibold whitespace-nowrap text-yellow-500 transition-colors hover:text-yellow-600"
                    >
                        {actionText}
                    </button>
                )}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="hover:text-gray-900 flex-shrink-0 cursor-pointer text-gray-400 transition-colors"
                >
                    <Icon name="x-circle" className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default CustomToast;
