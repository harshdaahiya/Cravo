import React from 'react';
import Icon from '../../../../components/ui/Icon';

interface EmailSettingsTabProps {
    email: string;
    isVerified?: boolean;
}

const EmailSettingsTab: React.FC<EmailSettingsTabProps> = ({ email, isVerified = true }) => {
    return (
        <div>
            <h2 className="text-foreground mb-4 text-lg font-semibold">
                Email Settings
            </h2>
            <div className="bg-muted flex items-center gap-3 rounded-lg px-3 py-2">
                <Icon name="mail" size={16} className="text-muted-foreground" />
                <span>{email}</span>
                {isVerified && (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs text-white">
                        <Icon name="check" size={12} /> Verified
                    </span>
                )}
            </div>
        </div>
    );
};

export default EmailSettingsTab;
