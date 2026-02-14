import { IList, ListModel } from '../models/list-model.js';
import { BaseRepository } from './base-repository.js';

export class ListRepository extends BaseRepository<IList> {
  constructor() {
    super(ListModel);
  }

  public async findByOwner(ownerId: string): Promise<IList[]> {
    return await this.find({ owner: ownerId });
  }

  public async findDefaultByOwner(ownerId: string): Promise<IList | null> {
    return await this.findOne({ owner: ownerId, isDefault: true });
  }
}

export const listRepository = new ListRepository();
