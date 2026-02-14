import { cityController } from '../controllers/city-controller.js';
import { BaseRouter } from './base-router.js';

export class CityRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.get('/', cityController.getAllCities);
    this.router.get('/serviceable', cityController.getServiceableCities);
    this.router.get('/nearest', cityController.getNearestCity);
  }
}

export const cityRouter = new CityRouter();
