import { orderController } from '../controllers/order-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class OrderRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);

    this.router.get('/', orderController.getAllUserOrders);
    this.router.get('/:id', orderController.getOrderById);
    this.router.post('/', orderController.createOrder);
    this.router.post('/:id/cancel', orderController.cancelOrder);
  }
}

export const orderRouter = new OrderRouter();
