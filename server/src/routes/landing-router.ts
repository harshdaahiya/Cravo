import { landingController } from '../controllers/landing-controller.js';
import { BaseRouter } from './base-router.js';

export class LandingRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/landing-page', landingController.getLandingPageData);
  }
}

export const landingRouter = new LandingRouter();
