import React from 'react';
import Icon, { IconName } from '../../../../components/ui/Icon';

interface TabButtonProps {
    id: string;
    label: string;
    icon: IconName;
    active: boolean;
    onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${active
            ? 'bg-primary text-foreground shadow-md'
            : 'text-muted-foreground hover:bg-muted'
            }`}
    >
        <Icon name={icon} className="h-5 w-5" />
        {label}
    </button>
);

export default TabButton;
