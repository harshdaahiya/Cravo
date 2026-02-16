import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { RootState } from '../../../store';
import { ICategory } from '../../../types/domain-models';

interface CategoryCardProps {
    c?: ICategory;
    width: string;
    onClick: (name: string) => void;
    isLoading?: boolean;
}

// This component can render either a real category card or a skeleton loader
const CategoryCard: React.FC<CategoryCardProps> = ({ c, width, onClick, isLoading }) => {
    if (isLoading || !c) {
        return (
            <div className="flex-shrink-0 sm:px-1" style={{ width }}>
                <div className="flex flex-col items-center justify-center">
                    <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100 sm:h-28 sm:w-28"></div>
                    <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex-shrink-0 sm:px-1"
            style={{ width }}
            onClick={() => onClick(c.name)}
        >
            <div className="flex cursor-pointer flex-col items-center justify-center transition-transform duration-200 ease-out hover:-translate-y-1">
                <img
                    src={c.image}
                    alt={c.name}
                    className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = '/placeholder-category.png';
                    }}
                />
                <span className="text-text-secondary text-md mt-2 text-center font-semibold">
                    {c.name}
                </span>
            </div>
        </div>
    );
};

const CategoriesSlider: React.FC = () => {
    const itemsPerView = { mobile: 2, tablet: 4, desktop: 6 };
    const [foodCategories, setFoodCategories] = useState<ICategory[]>([]);
    const { data, isAppInitializing: isLoading, appInitError: error } = useSelector((state: RootState) => state.landingPage);
    const { user } = useSelector((state: RootState) => state.auth);

    const userName = user?.name;
    const UserFirstName = userName?.split(' ')[0];

    const categoriesData = data.categories;

    const Statelocation = useSelector((state: RootState) => state.location);
    const { lat: latitude, lon: longitude } = Statelocation;

    const navigate = useNavigate();

    // Add a small delay to the data display for a smoother transition
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (categoriesData) {
            timer = setTimeout(() => {
                setFoodCategories([...categoriesData]);
            }, 300); // 300ms delay
        }

        // Cleanup the timer to prevent memory leaks
        return () => clearTimeout(timer);
    }, [categoriesData]);

    // SSR-safe "items per view"
    const getItemsPerView = () => {
        if (typeof window === 'undefined') return itemsPerView.mobile;
        if (window.innerWidth >= 1024) return itemsPerView.desktop;
        if (window.innerWidth >= 640) return itemsPerView.tablet;
        return itemsPerView.mobile;
    };

    const [itemsToShow, setItemsToShow] = useState(getItemsPerView());
    const [index, setIndex] = useState(0);

    // Update on resize
    useEffect(() => {
        const update = () => setItemsToShow(getItemsPerView());
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Split categories into two rows
    const totalCategories = foodCategories.length;
    const categoriesPerRow = Math.ceil(totalCategories / 2);
    const firstRowCategories = foodCategories.slice(0, categoriesPerRow);
    const secondRowCategories = foodCategories.slice(categoriesPerRow);

    // Keeping index in range when viewport shrinks
    const maxIndex = Math.max(0, categoriesPerRow - itemsToShow);
    useEffect(
        () => setIndex(i => Math.min(i, maxIndex)),
        [itemsToShow, maxIndex]
    );

    const cardWidthPct = 100 / itemsToShow;
    const translatePct = -index * cardWidthPct;

    const handleNavigateToCategoryResultPage = (categoryName: string) => {
        if (latitude && longitude) {
            navigate(`/categories/${categoryName}?lat=${latitude}&lng=${longitude}`);
        } else {
            navigate(`/categories/${categoryName}`);
        }
    };

    const renderContent = (categories: ICategory[]) => {
        // If loading, render skeleton cards
        if (isLoading) {
            return [...Array(itemsToShow * 2)].map((_, i) => (
                <CategoryCard
                    key={`skeleton-${i}`}
                    isLoading={true}
                    width={`${cardWidthPct}%`}
                    onClick={() => { }}
                />
            ));
        }
        // If not loading, render real category cards
        return categories.map(c => (
            <CategoryCard
                key={c._id || c.name}
                c={c}
                width={`${cardWidthPct}%`}
                onClick={handleNavigateToCategoryResultPage}
            />
        ));
    };

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

    return (
        <section className="bg-white py-5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-text-main text-xl font-semibold">
                        What's on your mind <span>{UserFirstName}</span> ?
                    </p>
                    {categoriesPerRow > itemsToShow && !isLoading && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIndex(i => Math.max(0, i - 1))}
                                disabled={index === 0}
                                className={`rounded-full border p-2 transition ${index === 0
                                    ? 'border-border cursor-not-allowed text-gray-300'
                                    : 'text-text-secondary hover:border-border-focus border-gray-300 hover:text-yellow-600'
                                    }`}
                            >
                                <Icon name={'chevron-left'} size={18} />
                            </button>
                            <button
                                onClick={() => setIndex(i => Math.min(maxIndex, i + 1))}
                                disabled={index === maxIndex}
                                className={`rounded-full border p-2 transition ${index === maxIndex
                                    ? 'border-border cursor-not-allowed text-gray-300'
                                    : 'text-text-secondary hover:border-border-focus border-gray-300 hover:text-yellow-600'
                                    }`}
                            >
                                <Icon name={'chevron-right'} size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(${translatePct}%)` }}
                        >
                            {renderContent(firstRowCategories)}
                        </div>
                    </div>
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(${translatePct}%)` }}
                        >
                            {renderContent(secondRowCategories)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSlider;
