import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { addressRepository, AddressRepository } from '../repositories/address-repository.js';
import mongoose from 'mongoose';

export class AddressController extends BaseController {
  private addressRepo: AddressRepository;

  constructor() {
    super();
    this.addressRepo = addressRepository;
  }

  public getAllAddresses = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      if (!userId) return this.sendError(res, 'Unauthorized', 401);

      const addresses = await this.addressRepo.find({ user: userId });
      const sortedAddresses = addresses.sort((a: any, b: any) => {
        if (a.isDefault === b.isDefault) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return a.isDefault ? -1 : 1;
      });

      return this.sendSuccess(res, { addresses: sortedAddresses }, 'Addresses retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve addresses', 500, error);
    }
  };

  public getAddressById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const addressId = id as string;
      
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return this.sendError(res, 'Invalid address ID', 400);
      }

      const address = await this.addressRepo.findOne({ _id: addressId, user: userId });
      if (!address) {
        return this.sendError(res, 'Address not found or unauthorized', 404);
      }

      return this.sendSuccess(res, { address }, 'Address retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve address', 500, error);
    }
  };

  public createAddress = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        addressType,
        isDefault,
      } = req.body;

      if (!addressLine1 || !city || !state || !zipCode || !country) {
        return this.sendError(res, 'Required address fields missing', 400);
      }

      if (isDefault) {
        await this.addressRepo.clearOtherDefaults(userId as string, '');
      }

      const newAddress = await this.addressRepo.create({
        user: userId,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        addressType,
        isDefault: isDefault || false,
      } as any);

      const allAddresses = await this.addressRepo.findByUser(userId as string);
      return this.sendSuccess(res, { addresses: allAddresses }, 'Address created successfully', 201);
    } catch (error: any) {
      return this.sendError(res, 'Failed to create address', 500, error);
    }
  };

  public updateAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const addressId = id as string;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return this.sendError(res, 'Invalid address ID', 400);
      }

      if (updates.isDefault) {
        await this.addressRepo.clearOtherDefaults(userId as string, addressId);
      }

      const updatedAddress = await this.addressRepo.update(addressId, updates);
      if (!updatedAddress) {
        return this.sendError(res, 'Address not found or unauthorized', 404);
      }

      const allAddresses = await this.addressRepo.findByUser(userId as string);
      return this.sendSuccess(res, { addresses: allAddresses }, 'Address updated successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to update address', 500, error);
    }
  };

  public deleteAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const addressId = id as string;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return this.sendError(res, 'Invalid address ID', 400);
      }

      const deleted = await this.addressRepo.delete(addressId);
      if (!deleted) {
        return this.sendError(res, 'Address not found or unauthorized', 404);
      }

      const allAddresses = await this.addressRepo.findByUser(userId as string);
      return this.sendSuccess(res, { addresses: allAddresses }, 'Address deleted successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to delete address', 500, error);
    }
  };
}

export const addressController = new AddressController();
