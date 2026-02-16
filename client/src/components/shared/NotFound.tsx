import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../ui/Button';
import Icon from '../ui/Icon';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-green-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="bg-gradient-to-r from-yellow-400 via-green-400 to-gray-800 bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
                        404
                    </h1>
                </div>

                {/* Main Icon */}
                <div className="mb-8">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
                        <span className="text-5xl">🍽️</span>
                    </div>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className="text-gray-900 mb-4 text-2xl font-bold md:text-3xl">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mx-auto max-w-md text-lg">
                        Sorry, the page you're looking for doesn't exist. Let's get you back
                        on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        to="/"
                        className="bg-primary hover:bg-yellow-600 inline-flex transform items-center rounded-xl px-8 py-4 font-semibold text-gray-900 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <Icon name={'home'} className="mr-2 h-5 w-5" />
                        Back to Cravo
                    </Link>

                    <Button
                        onClick={handleGoBack}
                        className="bg-green-500 hover:bg-green-600 inline-flex transform items-center rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        variant="primary"
                    >
                        <Icon name={'arrow-left'} className="mr-2 h-5 w-5" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
