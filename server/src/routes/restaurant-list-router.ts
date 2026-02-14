import { restaurantListController } from '../controllers/restaurant-list-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class RestaurantListRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);

    this.router.get('/', restaurantListController.getAllRestaurantListsOfUser);
    this.router.get('/:id', restaurantListController.getRestaurantListById);
    this.router.post('/', restaurantListController.createNewRestaurantList);
    this.router.post('/:id/add', restaurantListController.addRestaurantToList);
    this.router.post('/:id/remove', restaurantListController.removeRestaurantFromList);
    this.router.delete('/:id', restaurantListController.deleteRestaurantList);
  }
}

export const restaurantListRouter = new RestaurantListRouter();
