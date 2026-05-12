import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
            <h1 className="mb-4 text-4xl font-bold text-destructive">
                403 - Unauthorized Access
            </h1>
            <p className="text-muted-foreground mb-8 text-center text-lg">
                You do not have permission to view this page.
                <br />
                Please log in with an authorized account or contact support.
            </p>
            <Link
                to="/"
                className="rounded-xl bg-primary px-6 py-3 font-bold text-foreground shadow-md hover:bg-primary-hover transition-all"
            >
                Go to Home
            </Link>
            <Link
                to="/login"
                className="mt-4 font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
                Go to Login Page
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
