import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { reviewRepository, ReviewRepository } from '../repositories/review-repository.js';
import mongoose from 'mongoose';

export class ReviewController extends BaseController {
  private reviewRepo: ReviewRepository;

  constructor() {
    super();
    this.reviewRepo = reviewRepository;
  }

  public getProductReviews = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const pid = productId as string;
      
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        return this.sendError(res, 'Invalid product ID', 400);
      }

      const reviews = await this.reviewRepo.findByProduct(pid);
      const averageRating = await this.reviewRepo.getAverageRating(pid);

      return this.sendSuccess(res, { reviews, averageRating }, 'Product reviews retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve reviews', 500, error);
    }
  };

  public createReview = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const { productId, rating, comment } = req.body;

      if (!productId || !rating) {
        return this.sendError(res, 'Product ID and rating are required', 400);
      }

      // Check if user already reviewed this product
      const existing = await this.reviewRepo.findOne({ user: userId, product: productId as string });
      if (existing) {
        return this.sendError(res, 'You have already reviewed this product', 400);
      }

      const review = await this.reviewRepo.create({
        user: userId,
        product: productId as string,
        rating,
        comment,
        isVerifiedBuyer: false, // In a real app, check order history
      } as any);

      return this.sendSuccess(res, { review }, 'Review submitted successfully', 201);
    } catch (error: any) {
      return this.sendError(res, 'Failed to submit review', 500, error);
    }
  };
}

export const reviewController = new ReviewController();
