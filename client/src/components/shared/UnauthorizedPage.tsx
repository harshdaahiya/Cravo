import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="mb-4 text-4xl font-bold text-red-600">
                403 - Unauthorized Access
            </h1>
            <p className="text-gray-600 mb-8 text-center text-lg">
                You do not have permission to view this page.
                <br />
                Please log in with an authorized account or contact support.
            </p>
            <Link
                to="/"
                className="rounded-xl bg-primary px-6 py-3 font-bold text-gray-900 shadow-md hover:bg-yellow-600 transition-all"
            >
                Go to Home
            </Link>
            <Link
                to="/login"
                className="mt-4 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
                Go to Login Page
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
