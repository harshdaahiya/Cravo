import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { categoryRepository } from '../repositories/category-repository.js';
import { cityRepository } from '../repositories/city-repository.js';
import { restaurantRepository } from '../repositories/restaurant-repository.js';

export class LandingController extends BaseController {
  constructor() {
    super();
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  public getLandingPageData = async (req: Request, res: Response) => {
    try {
      const userLongitude = parseFloat(req.query.longitude as string);
      const userLatitude = parseFloat(req.query.latitude as string);
      const maxDistanceKm = parseFloat((req.query.maxDistanceKm as string) || '600');

      const [categories, cities] = await Promise.all([
        categoryRepository.getVisibleCategories(),
        cityRepository.find({}),
      ]);

      let selectedCity = null;
      let restaurantFetchLongitude = userLongitude;
      let restaurantFetchLatitude = userLatitude;
      let currentMaxDistance = maxDistanceKm;

      if (!isNaN(userLongitude) && !isNaN(userLatitude) && Array.isArray(cities)) {
        let minDistance = Infinity;
        cities.forEach((city: any) => {
          if (city.location?.coordinates) {
            const [cityLon, cityLat] = city.location.coordinates;
            const dist = this.calculateDistance(userLatitude, userLongitude, cityLat, cityLon);
            if (dist < minDistance) {
              minDistance = dist;
              selectedCity = city;
            }
          }
        });

        if (selectedCity) {
          const [cityLon, cityLat] = (selectedCity as any).location.coordinates;
          restaurantFetchLongitude = cityLon;
          restaurantFetchLatitude = cityLat;
          currentMaxDistance = (selectedCity as any).defaultRadiusKm || maxDistanceKm;
        }
      }

      const restaurants = await restaurantRepository.searchNearby(
        restaurantFetchLongitude,
        restaurantFetchLatitude,
        currentMaxDistance
      );

      const landingPageData = {
        categories: categories,
        featuredRestaurants: {
          count: restaurants.length,
          restaurants: restaurants
        },
        citiesWeServe: cities,
        selectedCity: selectedCity
          ? { 
              name: (selectedCity as any).name, 
              _id: (selectedCity as any)._id,
              location: (selectedCity as any).location
            }
          : null,
      };

      return this.sendSuccess(res, landingPageData, 'Landing page data fetched successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to load landing page data', 500, error);
    }
  };
}

export const landingController = new LandingController();
