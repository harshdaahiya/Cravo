import { productController } from '../controllers/product-controller.js';
import { BaseRouter } from './base-router.js';

export class ProductRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/', productController.getAllProducts);
    this.router.get('/:id', productController.getProductById);
    this.router.get('/category/:categoryId', productController.getProductsByCategory);
  }
}

export const productRouter = new ProductRouter();
