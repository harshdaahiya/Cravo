import React from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
    initial: string;
    onUpload: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ initial, onUpload }) => (
    <div className="relative mx-auto mb-4 h-24 w-24">
        <div className="bg-primary flex h-full w-full items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg">
            {initial}
        </div>
        <button
            onClick={onUpload}
            className="border-white absolute right-0 bottom-0 rounded-full border-4 bg-gray-900 p-2 text-white shadow-lg transition-transform hover:scale-110"
        >
            <Camera className="h-4 w-4" />
        </button>
    </div>
);

export default ProfileAvatar;
