import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(public readonly model: Model<T>) {}

  public async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  public async findById(id: string, populate?: any): Promise<T | null> {
    const query = this.model.findById(id);
    if (populate) query.populate(populate);
    return await query.exec();
  }

  public async findOne(filter: FilterQuery<T>, populate?: any): Promise<T | null> {
    const query = this.model.findOne(filter);
    if (populate) query.populate(populate);
    return await query.exec();
  }

  public async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}, populate?: any): Promise<T[]> {
    const query = this.model.find(filter, null, options);
    if (populate) query.populate(populate);
    return await query.exec();
  }

  public async update(id: string, data: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, options);
  }

  public async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  public async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}
