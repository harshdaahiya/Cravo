import React, { useState } from 'react';

import Icon, { IconName } from '../../components/ui/Icon';

interface SettingsState {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    promotionalEmails: boolean;
    weeklyDigest: boolean;
    soundNotifications: boolean;
    profileVisibility: string;
    showOrderHistory: boolean;
    shareLocation: boolean;
    allowReviews: boolean;
    darkMode: boolean;
    language: string;
    currency: string;
    autoReorder: boolean;
    savePaymentMethods: boolean;
    rememberAddresses: boolean;
    personalizedAds: boolean;
    dataCollection: boolean;
    thirdPartySharing: boolean;
    marketingCommunications: boolean;
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsState>({
        /* ---------- Notifications ---------- */
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotionalEmails: true,
        weeklyDigest: false,
        soundNotifications: true,
        /* ---------- Privacy ---------- */
        profileVisibility: 'public',
        showOrderHistory: false,
        shareLocation: true,
        allowReviews: true,
        /* ---------- App Prefs ---------- */
        darkMode: false,
        language: 'en',
        currency: 'USD',
        autoReorder: true,
        savePaymentMethods: true,
        rememberAddresses: true,
        /* ---------- Marketing ---------- */
        personalizedAds: true,
        dataCollection: true,
        thirdPartySharing: false,
        marketingCommunications: true,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    /* ───────────────────────────────
                  Helpers
    ─────────────────────────────── */
    const handleToggle = (key: keyof SettingsState) => setSettings(s => ({ ...s, [key]: !s[key] }));

    // const handleSelectChange = (key: keyof SettingsState, val: string | boolean) =>
    //     setSettings(s => ({ ...s, [key]: val }));

    const handleSaveSettings = () => console.log('Settings saved:', settings);

    const handleResetSettings = () => {
        if (window.confirm('Reset all settings to default?')) {
            setSettings({
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
                orderUpdates: true,
                promotionalEmails: false,
                weeklyDigest: false,
                soundNotifications: true,
                profileVisibility: 'public',
                showOrderHistory: false,
                shareLocation: false,
                allowReviews: true,
                darkMode: false,
                language: 'en',
                currency: 'USD',
                autoReorder: false,
                savePaymentMethods: true,
                rememberAddresses: true,
                personalizedAds: false,
                dataCollection: true,
                thirdPartySharing: false,
                marketingCommunications: false,
            });
        }
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmText === 'DELETE MY ACCOUNT') {
            console.log('Account deletion requested');
            setShowDeleteConfirm(false);
        }
    };

    /* ───────────────────────────────
             Reusable Components
    ─────────────────────────────── */
    interface ToggleSwitchProps {
        enabled: boolean;
        onToggle: () => void;
        disabled?: boolean;
    }

    const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle, disabled }) => (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:outline-none ${enabled ? 'bg-primary' : 'bg-gray-300'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    interface SettingItemProps {
        icon: IconName;
        title: string;
        description: string;
        children: React.ReactNode;
        warning?: boolean;
    }

    const SettingItem: React.FC<SettingItemProps> = ({
        icon,
        title,
        description,
        children,
        warning = false,
    }) => (
        <div
            className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${warning
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${warning ? 'bg-red-100' : 'bg-yellow-100'
                        }`}
                >
                    <Icon
                        name={icon}
                        className={`h-5 w-5 ${warning ? 'text-red-600' : 'text-yellow-600'}`}
                    />
                </div>
                <div className="flex-1">
                    <h3
                        className={`font-semibold ${warning ? 'text-red-800' : 'text-gray-900'}`}
                    >
                        {title}
                    </h3>
                    <p
                        className={`mt-1 text-sm ${warning ? 'text-red-600' : 'text-gray-500'
                            }`}
                    >
                        {description}
                    </p>
                </div>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );

    /* ───────────────────────────────
                  JSX
    ─────────────────────────────── */
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 text-3xl font-bold">Settings</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your account preferences and privacy
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleResetSettings}
                        className="text-gray-500 hover:text-gray-900 border-gray-200 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:border-gray-300"
                    >
                        <Icon name={'refresh-cw'} className="h-4 w-4" />
                        Reset
                    </button>
                    <button
                        onClick={handleSaveSettings}
                        className="bg-primary hover:bg-yellow-600 flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                        <Icon name={'save'} className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* 4. Data & Marketing */}
            <div className="border-gray-200 rounded-2xl border bg-white p-6 shadow-lg">
                <h2 className="text-gray-900 mb-6 flex items-center gap-3 text-xl font-bold">
                    <Icon name={'database'} className="h-6 w-6 text-yellow-600" />
                    Data &amp; Marketing
                </h2>
                <div className="space-y-4">
                    <SettingItem
                        icon={'star'}
                        title="Personalized Ads"
                        description="Show ads based on your preferences and order history"
                    >
                        <ToggleSwitch
                            enabled={settings.personalizedAds}
                            onToggle={() => handleToggle('personalizedAds')}
                        />
                    </SettingItem>

                    <SettingItem
                        icon={'database'}
                        title="Data Collection"
                        description="Allow collection of anonymized usage data to improve our service"
                    >
                        <ToggleSwitch
                            enabled={settings.dataCollection}
                            onToggle={() => handleToggle('dataCollection')}
                        />
                    </SettingItem>

                    <SettingItem
                        icon={'users'}
                        title="Third-Party Sharing"
                        description="Permit sharing of limited data with trusted partners"
                    >
                        <ToggleSwitch
                            enabled={settings.thirdPartySharing}
                            onToggle={() => handleToggle('thirdPartySharing')}
                        />
                    </SettingItem>

                    <SettingItem
                        icon={'mail'}
                        title="Marketing Communications"
                        description="Receive product updates and newsletters"
                    >
                        <ToggleSwitch
                            enabled={settings.marketingCommunications}
                            onToggle={() => handleToggle('marketingCommunications')}
                        />
                    </SettingItem>
                </div>
            </div>

            {/* 5. Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-red-700">
                    <Icon name={'alert-triangle'} className="h-6 w-6 text-red-600" />
                    Danger Zone
                </h2>
                <div className="space-y-4">
                    <SettingItem
                        icon={'lucide-trash-2'}
                        title="Delete Account"
                        description="Permanently delete your account and all associated data"
                        warning
                    >
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </SettingItem>
                </div>

                {/* Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="mt-6 space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-red-700">
                            Type <strong>DELETE MY ACCOUNT</strong> to confirm.
                        </p>
                        <input
                            value={deleteConfirmText}
                            onChange={e => setDeleteConfirmText(e.target.value)}
                            className="w-full rounded-lg border border-red-300 px-3 py-2 focus:ring-2 focus:ring-red-400"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText('');
                                }}
                                className="flex-1 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
