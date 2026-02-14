import { IRestaurantList, RestaurantListModel } from '../models/restaurant-list-model.js';
import { BaseRepository } from './base-repository.js';

export class RestaurantListRepository extends BaseRepository<IRestaurantList> {
  constructor() {
    super(RestaurantListModel);
  }

  public async findByOwner(ownerId: string): Promise<IRestaurantList[]> {
    return await this.find({ owner: ownerId });
  }

  public async findDefaultByOwner(ownerId: string): Promise<IRestaurantList | null> {
    return await this.findOne({ owner: ownerId, isDefault: true });
  }
}

export const restaurantListRepository = new RestaurantListRepository();
