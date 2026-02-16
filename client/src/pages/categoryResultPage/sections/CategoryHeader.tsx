import React from 'react';

interface CategoryHeaderProps {
    categoryName: string | undefined;
    categoryDescription: string;
    restaurantCount: number;
    cityName: string | null;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
    categoryName,
    categoryDescription,
    restaurantCount,
    cityName,
}) => {
    return (
        <div className="relative mb-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-2xl bg-gradient-to-bl from-yellow-50 to-transparent opacity-60"></div>

            <div className="relative z-10">
                {/* Category badge */}
                <div className="mb-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-yellow-300">
                    <span className="bg-primary mr-2 h-2 w-2 rounded-full"></span>
                    Category
                </div>

                {/* Main heading */}
                <h1 className="text-text-main mb-3 text-3xl leading-tight font-bold lg:text-4xl">
                    {categoryName}
                </h1>

                {/* Description */}
                <p className="text-text-secondary mb-6 max-w-2xl text-lg leading-relaxed lg:text-xl">
                    {categoryDescription}
                </p>

                {/* Meta information */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <div className="text-text-secondary flex items-center space-x-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <span className="font-medium">{restaurantCount}</span>
                        <span className="text-text-muted">restaurants available</span>
                    </div>

                    <div className="text-text-secondary flex items-center space-x-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-text-muted">Delivering to</span>
                        <span className="font-medium">{cityName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryHeader;
