import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store';

interface PrivateRouteProps {
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles = [] }) => {
    const { isAuthenticated, role, isInitialized, isAuthChecking } = useSelector(
        (state: RootState) => state.auth
    );

    if (isAuthChecking || !isInitialized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-gray-500 text-xl font-semibold animate-pulse">
                    Checking authentication...
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    }

    // If the user is NOT authenticated (and check is initialized) redirect him to unauthorized path or login
    // Note: Previous logic redirected to /unauthorized, but usually it's /login. 
    // Keeping as per previous logic unless instructed otherwise.
    return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
