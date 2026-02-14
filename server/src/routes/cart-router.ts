import { cartController } from '../controllers/cart-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class CartRouter extends BaseRouter {
  protected initializeRoutes(): void {
    // Apply checkAuth to all cart routes
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);

    this.router.get('/', cartController.getCart);
    this.router.post('/items', cartController.addItem);
    this.router.patch('/items/:itemId', cartController.updateQuantity);
    this.router.delete('/items/:itemId', cartController.removeItem);
    this.router.delete('/', cartController.clearCart);
  }
}

export const cartRouter = new CartRouter();
