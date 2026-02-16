import React from 'react';

import ProductCard from '../../../components/shared/ProductCard';
import Icon from '../../../components/ui/Icon';
import { IProduct } from '../../../types/domain-models';

interface ProductListProps {
    menuItems: IProduct[];
    activeFilter: string;
}

const ProductList: React.FC<ProductListProps> = ({ menuItems, activeFilter }) => {
    const filteredMenuItems = menuItems.filter(item => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Veg') return item.is_veg;
        if (activeFilter === 'Non-Veg') return !item.is_veg;
        if (activeFilter === 'Bestseller') return item.isBestseller;
        return true;
    });

    // Handle the "Bestseller" filter as a special case
    if (activeFilter === 'Bestseller') {
        return (
            <div className="mt-8">
                {filteredMenuItems.length > 0 ? (
                    <div id="bestsellers-section" className="mb-10">
                        <h2 className="text-text-main mb-4 flex items-center text-2xl font-bold">
                            <Icon
                                name="star"
                                className="mr-2 h-6 w-6 fill-current text-amber-500"
                            />{' '}
                            Bestsellers
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredMenuItems.map(item => (
                                <ProductCard key={item._id} item={item} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-text-secondary col-span-full mt-8 text-center text-lg">
                        No bestseller items available at the moment.
                    </p>
                )}
            </div>
        );
    }

    // For all other filters, group by category
    const categorizedItems = filteredMenuItems.reduce((acc: { [key: string]: IProduct[] }, item) => {
        const categoryName = typeof item.category === 'object' ? item.category.name : 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {});

    return (
        <div className="mt-8">
            {Object.entries(categorizedItems).length > 0 ? (
                Object.entries(categorizedItems).map(([category, items]) => (
                    <div
                        key={category}
                        id={category.toLowerCase().replace(/\s/g, '-')}
                        className="mb-10"
                    >
                        <h2 className="text-text-main mb-4 text-2xl font-bold">
                            {category}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map(item => (
                                <ProductCard key={item._id} item={item} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-text-secondary col-span-full mt-8 text-center text-lg">
                    No menu items available for this selection.
                </p>
            )}
        </div>
    );
};

export default ProductList;
