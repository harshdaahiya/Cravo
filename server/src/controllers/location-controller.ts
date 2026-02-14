import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import fetch from 'node-fetch';
import { cityRepository } from '../repositories/city-repository.js';

export class LocationController extends BaseController {
  constructor() {
    super();
  }

  private async getIPInfo(ip: string): Promise<any> {
    try {
      const res = await fetch(`https://ipinfo.io/${ip}/json`);
      const data: any = await res.json();
      if (data?.city) return data;
    } catch (e) {
      // Fallback
    }

    const res2 = await fetch(`http://ip-api.com/json/${ip}`);
    return await res2.json();
  }

  public getUserLocation = async (req: Request, res: Response) => {
    try {
      let userIP: any =
        req.headers['x-client-ip'] ||
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress ||
        req.ip;

      if (userIP && userIP.includes('::ffff:')) {
        userIP = userIP.split('::ffff:')[1];
      }

      if (!userIP || userIP === '127.0.0.1' || userIP === '::1') {
        userIP = ''; // ipinfo handles empty as current IP
      }

      const details = await this.getIPInfo(userIP);
      const [lat, lon] = (details.loc || `${details.lat},${details.lon}` || '0,0')
        .split(',')
        .map(Number);

      let resolvedCity = details.city;

      if (!resolvedCity) {
        const nearestCity = await cityRepository.findNearestCity(lon, lat);
        if (nearestCity) {
          resolvedCity = nearestCity.name;
        } else {
          resolvedCity = 'Indore'; // default fallback
        }
      }

      const locationData = {
        lat,
        lon,
        city: resolvedCity,
        region: details.region || '',
        regionName: details.regionName || details.region || '',
        country: details.country || 'India',
        countryCode: details.countryCode || details.country || 'IN',
        zip: details.postal || details.zip || '',
      };

      return this.sendSuccess(res, { location: locationData }, `User location resolved: ${resolvedCity}`);
    } catch (error: any) {
      return this.sendError(res, 'Failed to resolve user location', 500, error);
    }
  };
}

export const locationController = new LocationController();
