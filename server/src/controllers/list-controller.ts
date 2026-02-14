import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { listRepository, ListRepository } from '../repositories/list-repository.js';
import { productRepository } from '../repositories/product-repository.js';
import { UserModel } from '../models/user-model.js';
import mongoose from 'mongoose';

export class ListController extends BaseController {
  private listRepo: ListRepository;

  constructor() {
    super();
    this.listRepo = listRepository;
  }

  public createNewList = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const userId = (req.user as any)?._id;

      if (!name || name.trim() === '') {
        return this.sendError(res, 'List name is required', 400);
      }

      const existingList = await this.listRepo.findOne({ owner: userId, name: name.trim() });
      if (existingList) {
        return this.sendError(res, 'A list with this name already exists', 409);
      }

      const newList = await this.listRepo.create({
        name: name.trim(),
        owner: userId,
        items: [],
        isDefault: false,
      } as any);

      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { lists: newList._id } }
      );

      return this.sendSuccess(res, { list: newList }, 'List created successfully', 201);
    } catch (error: any) {
      return this.sendError(res, 'Failed to create list', 500, error);
    }
  };

  public getAllListOfUser = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const populate = req.query.populate === 'true';

      const population = populate ? {
        path: 'items',
        populate: { path: 'restaurant' }
      } : undefined;

      const userLists = await this.listRepo.find({ owner: userId }, {}, population);
      return this.sendSuccess(res, { lists: userLists }, 'User lists retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve user lists', 500, error);
    }
  };

  public getListById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const populate = req.query.populate === 'true';
      const listId = id as string;

      if (!mongoose.Types.ObjectId.isValid(listId)) {
        return this.sendError(res, 'Invalid list ID', 400);
      }

      const population = populate ? {
        path: 'items',
        populate: { path: 'restaurant' }
      } : undefined;

      const list = await this.listRepo.findOne({ _id: listId, owner: userId }, population);
      if (!list) {
        return this.sendError(res, 'List not found', 404);
      }

      return this.sendSuccess(res, { list }, 'List retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve list', 500, error);
    }
  };

  public addProductToList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { productId } = req.body;
      const userId = (req.user as any)?._id;
      const listId = id as string;
      const prodId = productId as string;

      if (!prodId) return this.sendError(res, 'Product ID is required', 400);

      const list = await this.listRepo.findOne({ _id: listId, owner: userId });
      if (!list) return this.sendError(res, 'List not found', 404);

      if (list.items.some(item => item.toString() === prodId)) {
        return this.sendError(res, 'Product is already in this list', 409);
      }

      const product = await productRepository.findById(prodId);
      if (!product) return this.sendError(res, 'Product not found', 404);

      const updatedList = await this.listRepo.update(listId, { $push: { items: prodId } } as any);
      const populatedList = await updatedList?.populate({
        path: 'items',
        populate: { path: 'restaurant' }
      });
      return this.sendSuccess(res, { list: populatedList }, 'Product added to list successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to add product to list', 500, error);
    }
  };

  public removeProductFromList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { productId } = req.body;
      const userId = (req.user as any)?._id;
      const listId = id as string;
      const prodId = productId as string;

      const updatedList = await this.listRepo.update(listId, { $pull: { items: prodId } } as any);
      if (!updatedList) return this.sendError(res, 'List not found', 404);

      const populatedList = await updatedList.populate({
        path: 'items',
        populate: { path: 'restaurant' }
      });
      return this.sendSuccess(res, { list: populatedList }, 'Product removed from list successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to remove product from list', 500, error);
    }
  };

  public deleteList = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const listId = id as string;

      const list = await this.listRepo.findOne({ _id: listId, owner: userId });
      if (!list) return this.sendError(res, 'List not found', 404);

      if (list.isDefault) return this.sendError(res, 'Cannot delete the default list', 403);

      await this.listRepo.delete(listId);
      await UserModel.findByIdAndUpdate(userId, { $pull: { lists: listId } });

      return this.sendSuccess(res, null, 'List deleted successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to delete list', 500, error);
    }
  };

  public transferProductToList = async (req: Request, res: Response) => {
    try {
      const { productId, sourceListId, destinationListId } = req.body;
      const userId = (req.user as any)?._id;
      const prodId = productId as string;
      const sId = sourceListId as string;
      const dId = destinationListId as string;

      if (!prodId || !sId || !dId) {
        return this.sendError(res, 'Missing required fields', 400);
      }

      const [sourceList, destinationList] = await Promise.all([
        this.listRepo.findOne({ _id: sId, owner: userId }),
        this.listRepo.findOne({ _id: dId, owner: userId }),
      ]);

      if (!sourceList || !destinationList) {
        return this.sendError(res, 'One or both lists not found', 404);
      }

      await Promise.all([
        this.listRepo.update(sId, { $pull: { items: prodId } } as any),
        this.listRepo.update(dId, { $push: { items: prodId } } as any),
      ]);

      const userLists = await this.listRepo.find({ owner: userId }, {}, {
        path: 'items',
        populate: { path: 'restaurant' }
      });
      return this.sendSuccess(res, { lists: userLists }, 'Product transferred successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to transfer product', 500, error);
    }
  };
}

export const listController = new ListController();
