import { BaseRouter } from '../base-router.js';
import { restaurantSuperAdminController } from '../../controllers/super-admin/restaurant-super-admin-controller.js';
import { checkAuth, isLoggedIn } from '../../middlewares/auth-middleware.js';

export class RestaurantSuperAdminRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/count', checkAuth, isLoggedIn, restaurantSuperAdminController.getTotalRestaurantCount);
    this.router.get('/city/:cityId', checkAuth, isLoggedIn, restaurantSuperAdminController.getRestaurantsByCity);
    this.router.delete('/:restaurantId', checkAuth, isLoggedIn, restaurantSuperAdminController.deleteRestaurant);
  }
}

export const restaurantSuperAdminRouter = new RestaurantSuperAdminRouter();
