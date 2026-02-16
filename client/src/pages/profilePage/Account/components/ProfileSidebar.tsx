import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import TabButton from './TabButton';
import { IconName } from '../../../../components/ui/Icon';
import { ProfileData } from './ProfileInfoTab';

interface ProfileSidebarProps {
    profileData: ProfileData;
    tab: string;
    setTab: (tab: string) => void;
    onAvatarUpload: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    profileData,
    tab,
    setTab,
    onAvatarUpload,
}) => {
    const tabs: { id: string; label: string; icon: IconName }[] = [
        { id: 'profile', label: 'Profile Info', icon: 'user' },
        { id: 'email', label: 'Email Settings', icon: 'mail' },
        { id: 'password', label: 'Change Password', icon: 'lock' },
    ];

    return (
        <div className="border-gray-200 col-span-4 flex flex-col items-center rounded-2xl border bg-white p-6 text-center shadow transition-all">
            <ProfileAvatar initial={profileData.firstName.charAt(0)} onUpload={onAvatarUpload} />

            <h1 className="text-gray-900 mt-4 text-xl font-bold">
                {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-500 text-sm">{profileData.email}</p>
            <p className="text-xs text-gray-400">
                Member since {new Date(profileData.joinDate).toLocaleDateString()}
            </p>

            <div className="mt-6 w-full space-y-2">
                {tabs.map(({ id, label, icon }) => (
                    <TabButton
                        key={id}
                        id={id}
                        label={label}
                        icon={icon}
                        active={tab === id}
                        onClick={setTab}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileSidebar;
