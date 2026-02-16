import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { RootState } from '../../../store';
import { ICategory } from '../../../types/domain-models';

interface CategorycardProps {
    c: ICategory;
    totalVisibleItems: number;
    gapValue: number;
    handleNavigateToCategoryResultPage: (categoryName: string) => void;
}

const Categorycard: React.FC<CategorycardProps> = ({
    c,
    totalVisibleItems,
    gapValue,
    handleNavigateToCategoryResultPage,
}) => {
    const calculatedWidth = `calc((100% - ${gapValue * (totalVisibleItems - 1)}px) / ${totalVisibleItems})`;

    return (
        <div className="flex-shrink-0" style={{ width: calculatedWidth }}>
            <div className="flex cursor-pointer flex-col items-center">
                <img
                    src={c.image}
                    alt={c.name}
                    className="h-20 w-20 rounded-full object-cover sm:h-22 sm:w-22 md:h-24 md:w-24"
                    onError={e => {
                        (e.target as HTMLImageElement).src = '/placeholder-category.png';
                    }}
                    onClick={() => handleNavigateToCategoryResultPage(c.name || c.slug || '')}
                />
                <span className="text-text-secondary mt-1 px-1 text-center text-sm font-semibold">
                    {c.name}
                </span>
            </div>
        </div>
    );
};

const RestaurantCategoriesSlider: React.FC = () => {
    // Define how many items should be visible per screen size
    const itemsPerView = { mobile: 4, tablet: 6, desktop: 8 };

    // Define the gap size in pixels. This is the **actual** space between cards.
    const cardGapPx = 8; // Example: 8px for a tight gap (Tailwind's gap-2)

    const [foodCategories, setFoodCategories] = useState<ICategory[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: landingData, isAppInitializing: isLoading, appInitError: error } = useSelector(
        (state: RootState) => state.landingPage
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const Statelocation = useSelector((state: RootState) => state.location);
    const { lat: latitude, lon: longitude } = Statelocation;

    const navigate = useNavigate();

    const userName = user?.name;
    const UserFirstName = userName ? userName.split(' ')[0] : '';

    useEffect(() => {
        if (landingData.categories) {
            setFoodCategories([...landingData.categories]);
        }
    }, [landingData.categories]);

    const getItemsPerView = () => {
        if (typeof window === 'undefined') return itemsPerView.mobile;
        if (window.innerWidth >= 1024) return itemsPerView.desktop;
        if (window.innerWidth >= 768) return itemsPerView.tablet;
        return itemsPerView.mobile;
    };

    const [visibleItemsCount, setVisibleItemsCount] = useState(getItemsPerView());

    useEffect(() => {
        const update = () => setVisibleItemsCount(getItemsPerView());
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Calculate the maximum index the slider can reach.
    const maxIndex = Math.max(0, foodCategories.length - visibleItemsCount);

    useEffect(() => {
        setCurrentIndex(prevIndex => Math.min(prevIndex, maxIndex));
    }, [visibleItemsCount, maxIndex, foodCategories.length]);

    const slideLeft = () => {
        setCurrentIndex(prevIndex => Math.max(0, prevIndex - 3));
    };

    const slideRight = () => {
        setCurrentIndex(prevIndex => Math.min(maxIndex, prevIndex + 3));
    };

    const handleNavigateToCategoryResultPage = (categoryName: string) => {
        if (latitude && longitude) {
            navigate(`/categories/${categoryName}?lat=${latitude}&lng=${longitude}`);
        } else {
            navigate(`/categories/${categoryName}`);
        }
    };

    // Calculate the width of one "slide step" (one card + its gap)
    const cardWidthWithGap = `calc((100% - ${cardGapPx * (visibleItemsCount - 1)}px) / ${visibleItemsCount} + ${cardGapPx}px)`;

    // Show loading state (skeleton loaders)
    if (isLoading) {
        return (
            <section className="bg-white py-5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-text-main text-xl font-bold">
                            {UserFirstName} What's on your mind?
                        </p>
                    </div>
                    <div className="flex" style={{ gap: `${cardGapPx}px` }}>
                        {[...Array(visibleItemsCount)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0"
                                style={{
                                    width: `calc((100% - ${cardGapPx * (visibleItemsCount - 1)}px) / ${visibleItemsCount})`,
                                }}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200 sm:h-24 sm:w-24 md:h-28 md:w-28"></div>
                                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Show error state
    if (error) {
        return (
            <section className="bg-white py-5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="py-8 text-center">
                        <p className="text-red-500">Failed to load categories</p>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if no categories (shouldn't happen with dummy data fallback)
    if (!foodCategories.length) {
        return null;
    }

    return (
        <section className="mb-2 bg-white py-2">
            <div className="border-border mx-auto box-border max-w-7xl border-b px-4 sm:px-6">
                {/* Header and navigation arrows */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-text-main text-xl font-bold">
                        {UserFirstName} What's on your mind?
                    </p>
                    {/* Show arrows only if there are more categories than can fit in view */}
                    {foodCategories.length > visibleItemsCount && (
                        <div className="flex gap-2">
                            <button
                                onClick={slideLeft}
                                disabled={currentIndex === 0}
                                className={`cursor-pointer rounded-full border p-2 transition ${currentIndex === 0
                                    ? 'border-border cursor-not-allowed text-gray-300'
                                    : 'text-text-secondary hover:border-border-focus border-gray-300 hover:text-yellow-600'
                                    }`}
                                aria-label="Previous categories"
                            >
                                <Icon name={'chevron-left'} size={18} />
                            </button>
                            <button
                                onClick={slideRight}
                                disabled={currentIndex === maxIndex}
                                className={`cursor-pointer rounded-full border p-2 transition ${currentIndex === maxIndex
                                    ? 'border-border cursor-not-allowed text-gray-300'
                                    : 'text-text-secondary hover:border-border-focus border-gray-300 hover:text-yellow-600'
                                    }`}
                                aria-label="Next categories"
                            >
                                <Icon name={'chevron-right'} size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Single row slider container */}
                <div className="relative overflow-hidden pb-5">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            // Removed the 'width' property from here
                            transform: `translateX(calc(-${currentIndex} * ${cardWidthWithGap}))`, // Precise translation
                            gap: `${cardGapPx}px`, // Apply the smaller gap here
                        }}
                    >
                        {foodCategories.map(c => (
                            <Categorycard
                                key={c._id}
                                c={c}
                                totalVisibleItems={visibleItemsCount}
                                gapValue={cardGapPx}
                                handleNavigateToCategoryResultPage={
                                    handleNavigateToCategoryResultPage
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RestaurantCategoriesSlider;
