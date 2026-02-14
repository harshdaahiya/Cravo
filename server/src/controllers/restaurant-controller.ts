import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { restaurantRepository, RestaurantRepository } from '../repositories/restaurant-repository.js';
import { productRepository } from '../repositories/product-repository.js';
import { cityRepository } from '../repositories/city-repository.js';
import { categoryRepository } from '../repositories/category-repository.js';
import mongoose from 'mongoose';

export class RestaurantController extends BaseController {
  private restaurantRepo: RestaurantRepository;

  constructor() {
    super();
    this.restaurantRepo = restaurantRepository;
  }

  public getAllProductsOfRestaurant = async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;

      if (!restaurantId) {
        return this.sendError(res, 'Restaurant ID is required', 400);
      }

      const id = restaurantId as string;
      const restaurant = await this.restaurantRepo.findById(id);
      if (!restaurant) {
        return this.sendError(res, 'Restaurant not found', 404);
      }

      const products = await productRepository.findByRestaurant(id);

      return this.sendSuccess(res, {
        products,
        restaurantDetails: restaurant
      }, `Fetched products for restaurant '${restaurant.name}' successfully`);
    } catch (error: any) {
      return this.sendError(res, 'Failed to fetch restaurant products', 500, error);
    }
  };

  public getRestaurantById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const restaurantId = id as string;
      
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return this.sendError(res, 'Invalid restaurant ID format', 400);
      }

      const restaurant = await this.restaurantRepo.findById(restaurantId);
      if (!restaurant) {
        return this.sendError(res, 'Restaurant not found', 404);
      }

      return this.sendSuccess(res, { restaurant }, 'Restaurant fetched successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to fetch restaurant', 500, error);
    }
  };

  public getRestaurantsByLocation = async (req: Request, res: Response) => {
    try {
      const { longitude, latitude, maxDistanceKm, cityName, categoryName, sort, limit, page } = req.query;

      const filter: any = { is_active: true };
      const options: any = {};
      
      const pageSize = parseInt(limit as string, 10) || 12;
      const currentPage = parseInt(page as string, 10) || 1;
      const skip = (currentPage - 1) * pageSize;

      options.limit = pageSize;
      options.skip = skip;
      
      if (sort === 'rating') options.sort = { rating: -1 };
      else if (sort === 'newest') options.sort = { createdAt: -1 };
      else if (sort === 'cost_low') options.sort = { cost_for_two: 1 };
      else if (sort === 'cost_high') options.sort = { cost_for_two: -1 };

      if (categoryName) {
        // Find the category by slug to get the correct name for matching
        const category = await categoryRepository.findBySlug(categoryName as string);
        if (category) {
          filter.cuisine_type = { $in: [category.name] };
        } else {
          // Fallback to exact match if category not found by slug
          filter.cuisine_type = { $in: [categoryName] };
        }
      }

      if (cityName) {
        const city = await cityRepository.findByName(cityName as string);
        if (city) {
          filter['address.city'] = city._id;
        }
      }

      // We'll use a separate filter for counting because $near is not supported by countDocuments
      const countFilter = { ...filter };

      if (longitude && latitude) {
        const lon = parseFloat(longitude as string);
        const lat = parseFloat(latitude as string);
        const dist = parseFloat((maxDistanceKm as string) || '50');

        filter['address.location'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            $maxDistance: dist * 1000,
          },
        };

        // For counting, use $geoWithin with $centerSphere which IS supported by countDocuments
        // radius in radians = distance / earth radius (approx 6378.1 km)
        countFilter['address.location'] = {
          $geoWithin: {
            $centerSphere: [[lon, lat], dist / 6378.1],
          },
        };
      }

      const totalResults = await this.restaurantRepo.count(countFilter);
      const restaurants = await this.restaurantRepo.find(filter, options, 'address.city');

      return this.sendSuccess(res, {
        totalResults,
        totalPages: Math.ceil(totalResults / pageSize),
        currentPage,
        pageSize,
        count: restaurants.length,
        restaurants
      }, 'Restaurants fetched successfully');

    } catch (error: any) {
      return this.sendError(res, 'Failed to fetch restaurants', 500, error);
    }
  };

  public getTopRatedRestaurants = async (req: Request, res: Response) => {
    // Set sort to rating for this specific endpoint
    req.query.sort = 'rating';
    return this.getRestaurantsByLocation(req, res);
  };
}

export const restaurantController = new RestaurantController();
