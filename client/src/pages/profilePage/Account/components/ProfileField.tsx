import React from 'react';

interface ProfileFieldProps {
    label: string;
    value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
    <div>
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
            {label}
        </label>
        <div className="font-semibold text-foreground">{value}</div>
    </div>
);

export default ProfileField;
