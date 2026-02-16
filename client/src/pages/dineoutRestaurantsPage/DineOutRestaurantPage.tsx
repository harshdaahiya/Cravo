import React from 'react';

import { ArrowLeft, Clock, Sparkles, Utensils } from 'lucide-react';

const DineoutRestaurantPage: React.FC = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-yellow-50 to-white px-4">
            {/* Back Button */}
            <button
                onClick={handleGoBack}
                className="hover:bg-gray-100 text-gray-900 border-gray-200 absolute top-6 left-6 flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2.5 font-semibold shadow-md transition-all hover:shadow-lg"
            >
                <ArrowLeft className="h-5 w-5" />
                Go Back
            </button>
            <div className="w-full max-w-2xl text-center">
                {/* Icon Container */}
                <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-200 opacity-50 blur-2xl"></div>
                    <div className="to-primary-hover relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 shadow-xl">
                        <Utensils className="text-gray-900 h-12 w-12" />
                    </div>
                </div>

                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                    <Sparkles className="h-4 w-4" />
                    Coming Soon
                </div>

                {/* Heading */}
                <h1 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                    We're Cooking Up
                    <span className="to-primary-hover block bg-gradient-to-r from-yellow-600 bg-clip-text text-transparent">
                        Something Special
                    </span>
                </h1>

                {/* Description */}
                <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                    Our dine-out restaurants feature is currently under development. We're
                    working hard to bring you an amazing experience very soon!
                </p>

                {/* Progress Indicator */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <p className="text-gray-500 text-sm font-semibold">
                        Expected Launch: Very Soon
                    </p>
                </div>

                {/* Decorative Element */}
                <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                        className="bg-primary h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                        className="bg-primary h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: '0.4s' }}
                    ></div>
                </div>

                {/* Bottom Info */}
                <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                    <p className="text-gray-500 text-sm">
                        In the meantime, explore our other amazing features and discover
                        great restaurants near you!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DineoutRestaurantPage;
