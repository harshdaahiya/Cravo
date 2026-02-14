import { cityAliases } from '../constants/city-aliases.js';

export class CityUtils {
  /**
   * Normalizes city name based on aliases.
   * Logic: 
   * 1. Trim and lowercase input.
   * 2. If it matches a canonical key or any of its aliases, return canonical name.
   * 3. Else return the original trimmed input.
   */
  public static normalizeCityName(cityFromIP: string | undefined): string | null {
    if (!cityFromIP) return null;
    const originalTrimmed = cityFromIP.trim();
    const lowerCity = originalTrimmed.toLowerCase();

    for (const [canonical, aliases] of Object.entries(cityAliases)) {
      if (
        canonical.toLowerCase() === lowerCity || 
        aliases.some(alias => alias.toLowerCase() === lowerCity)
      ) {
        return canonical;
      }
    }
    return originalTrimmed;
  }
}
