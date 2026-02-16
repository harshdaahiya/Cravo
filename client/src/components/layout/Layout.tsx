import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Navbar from './navbar/Navbar';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="app-content min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
