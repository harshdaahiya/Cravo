import { IProduct, ProductModel } from '../models/product-model.js';
import { BaseRepository } from './base-repository.js';
import { FilterQuery } from 'mongoose';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }

  public async findByCategory(categoryId: string): Promise<IProduct[]> {
    return await this.find({ category: categoryId });
  }

  public async findByRestaurant(restaurantId: string): Promise<IProduct[]> {
    return await this.find({ restaurant: restaurantId });
  }

  public async searchProducts(query: string): Promise<IProduct[]> {
    return await this.find({ $text: { $search: query } } as FilterQuery<IProduct>);
  }

  public async getBestsellers(): Promise<IProduct[]> {
    return await this.find({ isBestseller: true });
  }
}

export const productRepository = new ProductRepository();
