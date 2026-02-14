import { listRepository } from '../repositories/list-repository.js';
import { restaurantListRepository } from '../repositories/restaurant-list-repository.js';

export class UserService {
  public static generateUsername(email: string): string {
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    let usernameBase = email.split('@')[0];

    // Remove special characters (except letters and numbers)
    usernameBase = usernameBase.replace(/[^a-zA-Z0-9]/g, '');

    // Appending a random **two-digit** number to ensure uniqueness
    const randomNum = Math.floor(10 + Math.random() * 90);

    return `${usernameBase}${randomNum}`.toLowerCase();
  }

  public static async createDefaultLists(userId: string) {
    try {
      const productList = await listRepository.create({
        owner: userId as any,
        name: 'My Products',
        isDefault: true,
      } as any);

      const restaurantList = await restaurantListRepository.create({
        owner: userId as any,
        name: 'My Restaurants',
        isDefault: true,
      } as any);

      return { productList, restaurantList };
    } catch (error) {
      console.error(`Failed to create default lists for user ${userId}:`, error);
    }
  }
}
