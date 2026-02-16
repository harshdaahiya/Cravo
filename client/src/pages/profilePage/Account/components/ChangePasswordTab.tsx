import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordTabProps {
    onSubmit: (passwords: any) => void;
}

const ChangePasswordTab: React.FC<ChangePasswordTabProps> = ({ onSubmit }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const isPasswordValid =
        passwords.new.length >= 8 &&
        /[A-Z]/.test(passwords.new) &&
        /[0-9]/.test(passwords.new);

    const toggleVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-gray-900 text-xl font-bold">Change Password</h2>

            <div className="space-y-4">
                {[
                    { key: 'current', label: 'Current Password' },
                    { key: 'new', label: 'New Password' },
                    { key: 'confirm', label: 'Confirm New Password' },
                ].map(field => (
                    <div key={field.key}>
                        <label className="text-gray-900 mb-2 block text-sm font-semibold">
                            {field.label}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword[field.key as keyof typeof showPassword] ? 'text' : 'password'}
                                value={passwords[field.key as keyof typeof passwords]}
                                onChange={e =>
                                    setPasswords({ ...passwords, [field.key]: e.target.value })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                            />
                            <button
                                onClick={() => toggleVisibility(field.key as keyof typeof showPassword)}
                                className="text-gray-400 hover:text-gray-600 absolute top-1/2 right-4 -translate-y-1/2"
                            >
                                {showPassword[field.key as keyof typeof showPassword] ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Password Requirements */}
            <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="text-gray-900 mb-2 text-sm font-semibold">
                    Password Requirements:
                </h4>
                <ul className="text-gray-500 space-y-1 text-sm">
                    <li className={passwords.new.length >= 8 ? 'text-green-600' : ''}>
                        • At least 8 characters long
                    </li>
                    <li className={/[A-Z]/.test(passwords.new) ? 'text-green-600' : ''}>
                        • Contains at least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(passwords.new) ? 'text-green-600' : ''}>
                        • Contains at least one number
                    </li>
                    <li
                        className={
                            passwords.new === passwords.confirm && passwords.new !== ''
                                ? 'text-green-600'
                                : ''
                        }
                    >
                        • Passwords match
                    </li>
                </ul>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    disabled={!isPasswordValid || passwords.new !== passwords.confirm}
                    onClick={() => onSubmit(passwords)}
                    className="bg-primary hover:bg-yellow-600 disabled:bg-gray-300 rounded-xl px-8 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed"
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default ChangePasswordTab;
