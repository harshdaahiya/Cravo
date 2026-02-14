import { IUser, UserModel } from '../models/user-model.js';
import { BaseRepository } from './base-repository.js';
import { TokenService } from '../services/token-service.js';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  public async matchPassAndGenTokens(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found!');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new Error('Incorrect Password');
    }

    const payload = {
      _id: user._id as string,
      email: user.email as string,
      role: user.role,
    };

    const accessToken = TokenService.createAccessToken(payload);
    const refreshToken = TokenService.createRefreshToken(user._id as string);

    // Storing refresh token in DB (Note: keeping the logic similar to original)
    await this.update(user._id as string, { $push: { refreshTokens: { token: refreshToken, createdAt: new Date() } } });

    return { accessToken, refreshToken };
  }

  public async generateAccessAndRefreshToken(user: IUser): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const payload = {
        _id: user._id as string,
        email: user.email as string,
        role: user.role,
      };

      const accessToken = TokenService.createAccessToken(payload);
      const refreshToken = TokenService.createRefreshToken(user._id as string);

      await this.update(user._id as string, { $push: { refreshTokens: { token: refreshToken, createdAt: new Date() } } });

      return { accessToken, refreshToken };
    } catch (error: any) {
      throw new Error('Could not generate tokens: ' + error.message);
    }
  }
}

export const userRepository = new UserRepository();
