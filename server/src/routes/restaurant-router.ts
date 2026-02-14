import { restaurantController } from '../controllers/restaurant-controller.js';
import { BaseRouter } from './base-router.js';

export class RestaurantRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/top-rated', restaurantController.getTopRatedRestaurants);
    this.router.get('/', restaurantController.getRestaurantsByLocation);
    this.router.get('/:id', restaurantController.getRestaurantById);
    this.router.get('/:restaurantId/products', restaurantController.getAllProductsOfRestaurant);
  }
}

export const restaurantRouter = new RestaurantRouter();
