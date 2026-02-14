import { Request, Response } from 'express';
import { BaseController } from '../base-controller.js';
import { restaurantRepository, RestaurantRepository } from '../../repositories/restaurant-repository.js';
import mongoose from 'mongoose';

export class RestaurantSuperAdminController extends BaseController {
  private restaurantRepo: RestaurantRepository;

  constructor() {
    super();
    this.restaurantRepo = restaurantRepository;
  }

  public getTotalRestaurantCount = async (req: Request, res: Response) => {
    try {
      const totalCount = await this.restaurantRepo.count({});
      return this.sendSuccess(res, { total: totalCount }, 'Successfully fetched total restaurant count.');
    } catch (error: any) {
      return this.sendError(res, 'Failed to fetch total restaurant count', 500, error);
    }
  };

  public getRestaurantsByCity = async (req: Request, res: Response) => {
    try {
      const cityId = req.params.cityId as string;

      if (!cityId || !mongoose.Types.ObjectId.isValid(cityId)) {
        return this.sendError(res, 'Invalid or missing city ID.', 400);
      }

      const [restaurants, totalRestaurants] = await Promise.all([
        this.restaurantRepo.find({ 'address.city': cityId }, {}, 'address.city' as any),
        this.restaurantRepo.count({ 'address.city': cityId }),
      ]);

      if (restaurants.length === 0) {
        return this.sendSuccess(res, { restaurants: [], total: 0 }, 'No restaurants found in this city.');
      }

      return this.sendSuccess(res, { restaurants, total: totalRestaurants }, `Successfully fetched ${restaurants.length} restaurants for the city.`);
    } catch (error: any) {
      return this.sendError(res, 'Failed to fetch restaurants by city', 500, error);
    }
  };

  public deleteRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurantId = req.params.restaurantId as string;

      if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
        return this.sendError(res, 'Invalid or missing restaurant ID.', 400);
      }

      const restaurant = await this.restaurantRepo.delete(restaurantId);

      if (!restaurant) {
        return this.sendError(res, 'Restaurant not found.', 404);
      }

      return this.sendSuccess(res, null, `Restaurant "${restaurant.name}" successfully deleted.`);
    } catch (error: any) {
      return this.sendError(res, 'Failed to delete restaurant', 500, error);
    }
  };
}

export const restaurantSuperAdminController = new RestaurantSuperAdminController();
