import { IAddress, AddressModel } from '../models/address-model.js';
import { BaseRepository } from './base-repository.js';

export class AddressRepository extends BaseRepository<IAddress> {
  constructor() {
    super(AddressModel);
  }

  public async findByUser(userId: string): Promise<IAddress[]> {
    return await this.find({ user: userId });
  }

  public async findDefaultByUser(userId: string): Promise<IAddress | null> {
    return await this.findOne({ user: userId, isDefault: true });
  }

  public async clearOtherDefaults(userId: string, currentAddressId: string): Promise<void> {
    await this.model.updateMany(
      { user: userId, _id: { $ne: currentAddressId } },
      { isDefault: false }
    );
  }
}

export const addressRepository = new AddressRepository();
