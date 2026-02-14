import { paymentController } from '../controllers/payment-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class PaymentRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);
    this.router.post('/verify', paymentController.verifyPayment);
  }
}

export const paymentRouter = new PaymentRouter();
