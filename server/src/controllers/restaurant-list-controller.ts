import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { restaurantListRepository, RestaurantListRepository } from '../repositories/restaurant-list-repository.js';
import { restaurantRepository } from '../repositories/restaurant-repository.js';
import { UserModel } from '../models/user-model.js';
import mongoose from 'mongoose';

export class RestaurantListController extends BaseController {
  private resListRepo: RestaurantListRepository;

  constructor() {
    super();
    this.resListRepo = restaurantListRepository;
  }

  public createNewRestaurantList = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const userId = (req.user as any)?._id;

      if (!name || name.trim() === '') {
        return this.sendError(res, 'Restaurant list name is required', 400);
      }

      const existingList = await this.resListRepo.findOne({ owner: userId, name: name.trim() });
      if (existingList) {
        return this.sendError(res, 'A restaurant list with this name already exists', 409);
      }

      const newList = await this.resListRepo.create({
        name: name.trim(),
        owner: userId,
        restaurants: [],
        isDefault: false,
      } as any);

      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { restaurantLists: newList._id } }
      );

      return this.sendSuccess(res, { list: newList }, 'Restaurant list created successfully', 201);
    } catch (error: any) {
      return this.sendError(res, 'Failed to create restaurant list', 500, error);
    }
  };

  public getAllRestaurantListsOfUser = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const populate = req.query.populate === 'true';

      const population = populate ? 'restaurants' : undefined;

      const userLists = await this.resListRepo.find({ owner: userId }, {}, population);
      return this.sendSuccess(res, { lists: userLists }, 'User restaurant lists retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve restaurant lists', 500, error);
    }
  };

  public getRestaurantListById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const populate = req.query.populate === 'true';
      const listId = id as string;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return this.sendError(res, 'Invalid list ID', 400);
      }

      const population = populate ? 'restaurants' : undefined;

      const list = await this.resListRepo.findOne({ _id: listId, owner: userId }, population);
      if (!list) return this.sendError(res, 'Restaurant list not found', 404);

      return this.sendSuccess(res, { list }, 'Restaurant list retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve restaurant list', 500, error);
    }
  };

  public addRestaurantToList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { restaurantId } = req.body;
      const userId = (req.user as any)?._id;
      const listId = id as string;
      const restId = restaurantId as string;

      if (!restId) return this.sendError(res, 'Restaurant ID is required', 400);

      const list = await this.resListRepo.findOne({ _id: listId, owner: userId });
      if (!list) return this.sendError(res, 'Restaurant list not found', 404);

      if (list.restaurants.some(resId => resId.toString() === restId)) {
        return this.sendError(res, 'Restaurant is already in this list', 409);
      }

      const restaurant = await restaurantRepository.findById(restId);
      if (!restaurant) return this.sendError(res, 'Restaurant not found', 404);

      const updatedList = await this.resListRepo.update(listId, { $push: { restaurants: restId } } as any);
      const populatedList = await updatedList?.populate('restaurants');
      return this.sendSuccess(res, { list: populatedList }, 'Restaurant added to list successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to add restaurant to list', 500, error);
    }
  };

  public removeRestaurantFromList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { restaurantId } = req.body;
      const userId = (req.user as any)?._id;
      const listId = id as string;
      const restId = restaurantId as string;

      const updatedList = await this.resListRepo.update(listId, { $pull: { restaurants: restId } } as any);
      if (!updatedList) return this.sendError(res, 'Restaurant list not found', 404);

      const populatedList = await updatedList.populate('restaurants');
      return this.sendSuccess(res, { list: populatedList }, 'Restaurant removed from list successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to remove restaurant from list', 500, error);
    }
  };

  public deleteRestaurantList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const listId = id as string;

      const list = await this.resListRepo.findOne({ _id: listId, owner: userId });
      if (!list) return this.sendError(res, 'Restaurant list not found', 404);

      if (list.isDefault) return this.sendError(res, 'Cannot delete the default list', 403);

      await this.resListRepo.delete(listId);
      await UserModel.findByIdAndUpdate(userId, { $pull: { restaurantLists: listId } });

      return this.sendSuccess(res, null, 'Restaurant list deleted successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to delete restaurant list', 500, error);
    }
  };
}

export const restaurantListController = new RestaurantListController();
