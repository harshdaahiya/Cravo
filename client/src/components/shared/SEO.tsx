import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
    useEffect(() => {
        // 1. Update document title
        document.title = `${title} | Cravo`;

        // 2. Select or create meta description tag
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
    }, [title, description]);

    return null;
};

export default SEO;
