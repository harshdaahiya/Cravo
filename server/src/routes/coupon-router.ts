import { couponController } from '../controllers/coupon-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, authorizeRoles } from '../middlewares/auth-middleware.js';

export class CouponRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/', couponController.getAllCoupons);
    this.router.post('/validate', couponController.validateCoupon);
  }
}

export const couponRouter = new CouponRouter();
