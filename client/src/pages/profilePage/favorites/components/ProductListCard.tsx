import React from 'react';
import ProductCard from '../../../../components/shared/ProductCard';
import { IProduct } from '../../../../types/domain-models';

interface ProductListCardProps {
    item: string | IProduct;
}

const ProductListCard: React.FC<ProductListCardProps> = ({ item }) => {
    return <ProductCard item={item} />;
};

export default ProductListCard;
