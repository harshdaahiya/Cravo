import JWT from 'jsonwebtoken';
import { configService } from './config-service.js';

export interface ITokenPayload {
  _id: string;
  email: string;
  role: string;
}

export class TokenService {
  public static createAccessToken(payload: ITokenPayload): string {
    return JWT.sign(payload, configService.accessTokenSecret, {
      expiresIn: configService.accessTokenExpiry as any,
    });
  }

  public static createRefreshToken(userId: string): string {
    return JWT.sign({ userId }, configService.refreshTokenSecret, {
      expiresIn: configService.refreshTokenExpiry as any,
    });
  }

  public static validateToken(token: string): any {
    return JWT.verify(token, configService.accessTokenSecret);
  }
}
