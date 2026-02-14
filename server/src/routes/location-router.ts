import { locationController } from '../controllers/location-controller.js';
import { BaseRouter } from './base-router.js';

export class LocationRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/user-location', locationController.getUserLocation);
  }
}

export const locationRouter = new LocationRouter();
