import React from 'react';
import SEO from '../../components/shared/SEO';

const AdminPage: React.FC = () => {
    return (
        <>
            <SEO
                title="Admin Control Panel"
                description="Cravo administrator portal for managing restaurants, orders, users, analytics, and platform configurations."
            />
            <div className="">Admin page</div>
        </>
    );
};

export default AdminPage;
