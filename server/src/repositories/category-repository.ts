import { ICategory, CategoryModel } from '../models/category-model.js';
import { BaseRepository } from './base-repository.js';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }

  public async findBySlug(slug: string): Promise<ICategory | null> {
    return await this.findOne({ slug });
  }

  public async getVisibleCategories(): Promise<ICategory[]> {
    return await this.find({ isVisible: true }, { sort: { displayOrder: 1 } });
  }
}

export const categoryRepository = new CategoryRepository();
