import React from 'react';

const ExploreMore: React.FC = () => {
    const categories = [
        'Burgers',
        'Chinese',
        'Desserts',
        'South Indian',
        'Healthy',
        'Biryani',
    ];

    return (
        <div className="mt-12">
            <h2 className="text-text-main mb-4 text-2xl font-bold">
                Explore More Categories
            </h2>
            <div className="flex flex-wrap gap-4">
                {categories.map(item => (
                    <button
                        key={item}
                        className="text-text-secondary rounded-xl bg-gray-100 px-5 py-2 font-medium transition-all hover:bg-yellow-100"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExploreMore;
