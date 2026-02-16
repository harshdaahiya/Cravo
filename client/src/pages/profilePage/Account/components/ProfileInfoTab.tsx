import React from 'react';
import ProfileField from './ProfileField';

export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
}

interface ProfileInfoTabProps {
    profileData: ProfileData;
}

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ profileData }) => {
    return (
        <div>
            <h2 className="text-gray-900 mb-4 text-lg font-semibold">Profile Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <ProfileField label="First Name" value={profileData.firstName} />
                <ProfileField label="Last Name" value={profileData.lastName} />
                <ProfileField label="Phone" value={profileData.phone} />
                <ProfileField label="Address" value={profileData.address} />
            </div>
        </div>
    );
};

export default ProfileInfoTab;
