import { IRestaurant, RestaurantModel } from '../models/restaurant-model.js';
import { BaseRepository } from './base-repository.js';
import { FilterQuery } from 'mongoose';

export class RestaurantRepository extends BaseRepository<IRestaurant> {
  constructor() {
    super(RestaurantModel);
  }

  public async findByCity(cityId: string): Promise<IRestaurant[]> {
    return await this.find({ 'address.city': cityId });
  }

  public async findVegOnly(cityId?: string): Promise<IRestaurant[]> {
    const filter: FilterQuery<IRestaurant> = { is_veg: true };
    if (cityId) filter['address.city'] = cityId;
    return await this.find(filter);
  }

  public async findActiveRestaurants(): Promise<IRestaurant[]> {
    return await this.find({ is_active: true });
  }

  public async searchNearby(longitude: number, latitude: number, radiusKm: number): Promise<IRestaurant[]> {
    return await this.find({
      'address.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000, // MongoDB uses meters
        },
      },
    } as FilterQuery<IRestaurant>);
  }
}

export const restaurantRepository = new RestaurantRepository();
