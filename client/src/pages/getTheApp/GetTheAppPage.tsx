import React from 'react';

import {
    CreditCard,
    MapPin,
    QrCode,
    Star,
    Target,
    UtensilsCrossed,
    Zap,
} from 'lucide-react';

export default function CravoGetTheAPP() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
            {/* Floating Food Emojis */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-10">
                <div
                    className="absolute top-20 left-20 animate-bounce text-6xl"
                    style={{ animationDelay: '0s', animationDuration: '3s' }}
                >
                    🍕
                </div>
                <div
                    className="absolute top-40 right-32 animate-bounce text-6xl"
                    style={{ animationDelay: '1s', animationDuration: '4s' }}
                >
                    🍔
                </div>
                <div
                    className="absolute bottom-32 left-32 animate-bounce text-6xl"
                    style={{ animationDelay: '2s', animationDuration: '3.5s' }}
                >
                    🍜
                </div>
                <div
                    className="absolute right-20 bottom-48 animate-bounce text-6xl"
                    style={{ animationDelay: '1.5s', animationDuration: '4s' }}
                >
                    🌮
                </div>
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <header className="mb-16">
                    <div className="mb-4 flex items-center space-x-1">
                        <div className="h-18 w-18 cursor-pointer rounded-xl">
                            <img src="/assets/Cravo_logo.png" alt="Cravo Logo" />
                        </div>
                        <div className="w-32">
                            <img
                                src="/assets/Cravo_text_black_logo.png"
                                alt="Cravo Text Logo"
                                className="h-10"
                            />
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="mb-32 grid items-center gap-16 lg:grid-cols-2">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <h2 className="bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-6xl leading-tight font-bold text-transparent">
                            Delicious Food, Delivered Fast
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed">
                            Experience the best food delivery service right at your
                            fingertips. Order from your favorite restaurants and enjoy quick,
                            reliable delivery.
                        </p>

                        {/* Download Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button className="group text-gray-900 flex transform items-center gap-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-yellow-500 hover:to-amber-500 hover:shadow-xl">
                                <svg
                                    className="h-8 w-8"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M17.523 15.341c-.476 2.225-2.175 4.092-4.432 4.092-1.511 0-1.997-.986-3.727-.986-1.765 0-2.357.956-3.727.986-2.291.06-4.25-2.175-4.75-4.432-.986-4.432.255-9.771 4.45-10.116 1.067-.09 2.067.61 2.732.61.665 0 1.911-.75 3.227-.64 1.316.11 2.301.75 2.953 1.881-2.633 1.441-2.201 5.197.274 6.605zm-1.273-8.836c-1.261.15-2.447-.75-2.747-1.651-.3-.901.225-1.861 1.186-2.161 1.411-.45 2.932.45 3.232 1.711.3 1.261-.72 1.951-1.671 2.101z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Download on the</div>
                                    <div className="text-lg font-bold">App Store</div>
                                </div>
                            </button>

                            <button className="group text-gray-900 flex transform items-center gap-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-yellow-500 hover:to-amber-500 hover:shadow-xl">
                                <svg
                                    className="h-8 w-8"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.921V2.735a1 1 0 0 1 .609-.921zM14.5 12.707l2.542 2.542-9.5 5.492L14.5 12.707zm0-1.414L7.542 4.258l9.5 5.493L14.5 11.293zm3.967-1.908l2.526 1.441c.576.329.576 1.158 0 1.488l-2.526 1.441-2.679-2.685 2.679-2.685z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Get it on</div>
                                    <div className="text-lg font-bold">Google Play</div>
                                </div>
                            </button>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-12 border-t-2 border-yellow-200 pt-8">
                            <div className="flex items-start gap-6">
                                <div className="border-gray-200 rounded-2xl border-2 bg-white p-4 shadow-xl">
                                    <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400">
                                        <QrCode className="text-gray-900 h-20 w-20" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-gray-900 mb-2 text-xl font-bold">
                                        Scan to Download
                                    </h3>
                                    <p className="text-gray-600">
                                        Scan this QR code with your phone camera to download the
                                        Cravo app instantly!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Phone Mockup - More Realistic */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Phone Frame */}
                            <div className="relative h-[650px] w-80">
                                {/* Phone Body */}
                                <div className="absolute inset-0 rounded-[3.5rem] bg-gray-900 shadow-2xl">
                                    {/* Screen */}
                                    <div className="absolute top-3 right-3 bottom-3 left-3 overflow-hidden rounded-[3rem] bg-white">
                                        {/* Status Bar */}
                                        <div className="flex h-12 items-center justify-between bg-gradient-to-r from-yellow-400 to-amber-400 px-6">
                                            <span className="text-gray-900 text-xs font-semibold">
                                                9:41
                                            </span>
                                            <div className="flex gap-1">
                                                <div className="h-3 w-1 rounded-full bg-gray-900"></div>
                                                <div className="h-3 w-1 rounded-full bg-gray-900"></div>
                                                <div className="h-3 w-1 rounded-full bg-gray-900"></div>
                                                <div className="h-3 w-1 rounded-full bg-gray-900"></div>
                                            </div>
                                        </div>

                                        {/* App Content */}
                                        <div className="h-full bg-gradient-to-br from-yellow-50 to-white p-6">
                                            {/* App Logo and Name */}
                                            <div className="mb-8 text-center">
                                                <div className="shadow-x mb-4 inline-flex flex-col items-center justify-center rounded-3xl">
                                                    <div className="h-18 w-18 cursor-pointer rounded-xl">
                                                        <img
                                                            src="/assets/Cravo_logo.png"
                                                            alt="Cravo Logo"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-32">
                                                    <img
                                                        src="/assets/Cravo_text_black_logo.png"
                                                        alt="Cravo Text Logo"
                                                        className="h-10"
                                                    />
                                                </div>

                                                <p className="text-gray-500 mt-2 text-sm">
                                                    Food Delivery App
                                                </p>
                                            </div>

                                            {/* Mock UI Elements */}
                                            <div className="mt-8 space-y-4">
                                                {/* Search Bar */}
                                                <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-md">
                                                    <div className="h-3 w-32 rounded-full bg-gray-200"></div>
                                                </div>

                                                {/* Categories */}
                                                <div className="flex gap-3 overflow-hidden">
                                                    <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 shadow-md"></div>
                                                    <div className="h-20 w-20 flex-shrink-0 rounded-2xl border border-yellow-200 bg-white shadow-md"></div>
                                                    <div className="h-20 w-20 flex-shrink-0 rounded-2xl border border-yellow-200 bg-white shadow-md"></div>
                                                </div>

                                                {/* Food Cards */}
                                                <div className="space-y-3">
                                                    <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-md">
                                                        <div className="flex gap-3">
                                                            <div className="from-primary h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br to-amber-300"></div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-2 w-full rounded-full bg-gray-200"></div>
                                                                <div className="h-2 w-3/4 rounded-full bg-gray-200"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-md">
                                                        <div className="flex gap-3">
                                                            <div className="from-primary h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br to-amber-300"></div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-2 w-full rounded-full bg-gray-200"></div>
                                                                <div className="h-2 w-3/4 rounded-full bg-gray-200"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 h-8 w-40 -translate-x-1/2 transform rounded-b-3xl bg-gray-900"></div>
                                </div>

                                {/* Side Buttons */}
                                <div className="absolute top-32 right-0 h-16 w-1 rounded-l bg-gray-800"></div>
                                <div className="absolute top-52 right-0 h-12 w-1 rounded-l bg-gray-800"></div>
                                <div className="absolute top-68 right-0 h-12 w-1 rounded-l bg-gray-800"></div>
                            </div>

                            {/* Floating Animation Elements */}
                            <div className="bg-primary absolute -top-4 -right-4 h-20 w-20 animate-ping rounded-full opacity-20"></div>
                            <div
                                className="absolute -bottom-4 -left-4 h-16 w-16 animate-ping rounded-full bg-amber-400 opacity-20"
                                style={{ animationDelay: '1s' }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <h2 className="mb-16 bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-center text-5xl font-bold text-transparent">
                        Why Choose Cravo?
                    </h2>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <Zap className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Lightning Fast Delivery
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get your food delivered hot and fresh in record time with our
                                efficient delivery network.
                            </p>
                        </div>

                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <UtensilsCrossed className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Wide Restaurant Selection
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Choose from thousands of restaurants offering cuisines from
                                around the world.
                            </p>
                        </div>

                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <CreditCard className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Secure Payments
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Multiple payment options with bank-level security to keep your
                                transactions safe.
                            </p>
                        </div>

                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <MapPin className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Real-Time Tracking
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track your order in real-time and know exactly when it will
                                arrive at your door.
                            </p>
                        </div>

                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <Star className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Exclusive Deals
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enjoy special discounts and offers available only on the Cravo
                                app.
                            </p>
                        </div>

                        <div className="group hover:border-yellow-400 transform rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-400 transition-transform group-hover:scale-110">
                                <Target className="text-gray-900 h-8 w-8" />
                            </div>
                            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
                                Easy to Use
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Simple, intuitive interface that makes ordering food a
                                delightful experience.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
