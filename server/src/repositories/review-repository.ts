import { IReview, ReviewModel } from '../models/review-model.js';
import { BaseRepository } from './base-repository.js';

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(ReviewModel);
  }

  public async findByProduct(productId: string): Promise<IReview[]> {
    return await this.find({ product: productId });
  }

  public async findByUser(userId: string): Promise<IReview[]> {
    return await this.find({ user: userId });
  }

  public async getAverageRating(productId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { product: new (require('mongoose')).Types.ObjectId(productId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    return result.length > 0 ? result[0].averageRating : 0;
  }
}

export const reviewRepository = new ReviewRepository();
