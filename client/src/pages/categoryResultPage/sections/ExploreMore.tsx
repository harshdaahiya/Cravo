import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ExploreMore: React.FC = () => {
    const categories = [
        'Burgers',
        'Chinese',
        'Desserts',
        'South Indian',
        'Healthy',
        'Biryani',
    ];

    const navigate = useNavigate();
    const { lat: latitude, lon: longitude } = useSelector(
        (state: RootState) => state.location
    );

    const handleNavigate = (categoryName: string) => {
        // use lowercased category name for the slug
        const slug = categoryName.toLowerCase();
        if (latitude && longitude) {
            navigate(`/categories/${slug}?lat=${latitude}&lng=${longitude}`);
        } else {
            navigate(`/categories/${slug}`);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-foreground mb-4 text-2xl font-bold">
                Explore More Categories
            </h2>
            <div className="flex flex-wrap gap-4">
                {categories.map(item => (
                    <button
                        key={item}
                        onClick={() => handleNavigate(item)}
                        className="text-text-secondary rounded-xl bg-muted px-5 py-2 font-medium transition-all hover:bg-warning-muted"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExploreMore;
