import { reviewController } from '../controllers/review-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';

export class ReviewRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/product/:productId', reviewController.getProductReviews);
    
    // Protected routes
    this.router.use(checkAuth);
    this.router.use(isLoggedIn);
    this.router.post('/', reviewController.createReview);
  }
}

export const reviewRouter = new ReviewRouter();
