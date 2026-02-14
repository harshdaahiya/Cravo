import { ICity, CityModel } from '../models/city-model.js';
import { BaseRepository } from './base-repository.js';

export class CityRepository extends BaseRepository<ICity> {
  constructor() {
    super(CityModel);
  }

  public async findServiceableCities(): Promise<ICity[]> {
    return await this.find({ is_serviceable: true });
  }

  public async findByName(name: string): Promise<ICity | null> {
    return await this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  public async findNearestCity(longitude: number, latitude: number): Promise<ICity | null> {
    const results = await this.model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          spherical: true,
          query: { is_serviceable: true },
        },
      },
      { $limit: 1 },
    ]);
    return results.length > 0 ? results[0] : null;
  }
}

export const cityRepository = new CityRepository();
