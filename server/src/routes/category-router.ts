import { categoryController } from '../controllers/category-controller.js';
import { BaseRouter } from './base-router.js';

export class CategoryRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/', categoryController.getAllCategories);
    this.router.get('/:slug', categoryController.getCategoryBySlug);
  }
}

export const categoryRouter = new CategoryRouter();
