import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { cityRepository, CityRepository } from '../repositories/city-repository.js';

export class CityController extends BaseController {
  private cityRepo: CityRepository;

  constructor() {
    super();
    this.cityRepo = cityRepository;
  }

  public getAllCities = async (req: Request, res: Response) => {
    try {
      const cities = await this.cityRepo.find({});
      return this.sendSuccess(res, { cities }, 'Cities retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve cities', 500, error);
    }
  };

  public getServiceableCities = async (req: Request, res: Response) => {
    try {
      const cities = await this.cityRepo.findServiceableCities();
      return this.sendSuccess(res, { cities }, 'Serviceable cities retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve serviceable cities', 500, error);
    }
  };

  public getNearestCity = async (req: Request, res: Response) => {
    try {
      const { longitude, latitude } = req.query;
      if (!longitude || !latitude) {
        return this.sendError(res, 'Longitude and latitude are required', 400);
      }

      const lon = parseFloat(longitude as string);
      const lat = parseFloat(latitude as string);

      const city = await this.cityRepo.findNearestCity(lon, lat);
      if (!city) {
        return this.sendError(res, 'No serviceable city found nearby', 404);
      }

      return this.sendSuccess(res, { city }, 'Nearest serviceable city found');
    } catch (error: any) {
      return this.sendError(res, 'Failed to find nearest city', 500, error);
    }
  };
}

export const cityController = new CityController();
