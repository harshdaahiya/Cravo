import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { categoryRepository, CategoryRepository } from '../repositories/category-repository.js';

export class CategoryController extends BaseController {
  private categoryRepo: CategoryRepository;

  constructor() {
    super();
    this.categoryRepo = categoryRepository;
  }

  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryRepo.getVisibleCategories();
      return this.sendSuccess(res, { categories }, 'Categories retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve categories', 500, error);
    }
  };

  public getCategoryBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await this.categoryRepo.findBySlug(slug as string);
      
      if (!category) {
        return this.sendError(res, 'Category not found', 404);
      }
      
      return this.sendSuccess(res, { category }, 'Category retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve category', 500, error);
    }
  };
}

export const categoryController = new CategoryController();
