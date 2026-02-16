import React from 'react';
import ProductCard from '../../../../components/shared/ProductCard';
import { IProduct } from '../../../../types/domain-models';

interface ProductGridCardProps {
    item: string | IProduct;
    listId: string;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({ item, listId }) => {
    return <ProductCard item={item} listId={listId} />;
};

export default ProductGridCard;
