import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base-controller.js';
import { userRepository, UserRepository } from '../repositories/user-repository.js';
import { configService } from '../services/config-service.js';
import { emailService } from '../services/email-service.js';
import { UserService } from '../services/user-service.js';
import { TokenService } from '../services/token-service.js';
import JWT from 'jsonwebtoken';

export class AuthController extends BaseController {
  private userRepo: UserRepository;

  constructor() {
    super();
    this.userRepo = userRepository;
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return this.sendError(res, 'Email and password are required', 400);
      }

      const user = await this.userRepo.findOne({ email });
      if (!user) {
        return this.sendError(res, 'User not found with this email', 404);
      }

      if (user.googleId) {
        return this.sendError(res, 'This account was created with Google. Please log in with Google.', 401);
      }

      if (!user.isVerified) {
        return this.sendError(res, 'Account not verified. Please check your email for the OTP.', 403);
      }

      const { accessToken, refreshToken } = await this.userRepo.matchPassAndGenTokens(email, password);

      const cookieOptions = {
        httpOnly: true,
        secure: configService.nodeEnv === 'production',
        sameSite: (configService.nodeEnv === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
        path: '/',
      };

      res.cookie('refreshToken', refreshToken, cookieOptions);

      return this.sendSuccess(res, {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        },
        accessToken,
      }, 'User logged in successfully');
    } catch (error: any) {
      return this.sendError(res, error.message, 401, error);
    }
  };

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return this.sendError(res, 'All fields are required', 400);
      }

      const existingUser = await this.userRepo.findOne({ email });
      if (existingUser && existingUser.isVerified) {
        return this.sendError(res, 'User already exists. Please login.', 409);
      }

      if (existingUser && !existingUser.isVerified) {
        if (existingUser.verificationOTPExpires! < new Date()) {
          await this.userRepo.delete(existingUser._id as string);
        } else {
          return this.sendError(res, 'OTP already sent. Please check your email.', 409);
        }
      }

      const username = UserService.generateUsername(email);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const newUser = await this.userRepo.create({
        username,
        name,
        email,
        password,
        isVerified: false,
        verificationOTP: otp,
        verificationOTPExpires: otpExpires,
      } as any);

      await UserService.createDefaultLists(newUser._id as string);
      await emailService.sendVerificationOTP(email, otp);

      return this.sendSuccess(res, { user: { email } }, 'User registered successfully. Please check your email for the OTP.', 201);
    } catch (error: any) {
      return this.sendError(res, 'Failed to register user', 500, error);
    }
  };

  public verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const user = await this.userRepo.findOne({ email, verificationOTP: otp });

      if (!user) {
        return this.sendError(res, 'Invalid OTP', 400);
      }

      if (user.verificationOTPExpires! < new Date()) {
        return this.sendError(res, 'OTP expired. Please request a new one.', 400);
      }

      user.isVerified = true;
      user.verificationOTP = undefined;
      user.verificationOTPExpires = undefined;

      const { accessToken, refreshToken } = await this.userRepo.generateAccessAndRefreshToken(user);

      const isProduction = configService.nodeEnv === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return this.sendSuccess(res, {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
      }, 'OTP verified successfully! You are now logged in.');
    } catch (error: any) {
      return this.sendError(res, 'Failed to verify OTP', 500, error);
    }
  };

  public refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        return this.sendError(res, 'Session expired. Please log in again.', 401);
      }

      let decoded: any;
      try {
        decoded = JWT.verify(refreshToken, configService.refreshTokenSecret);
      } catch (err) {
        return this.sendError(res, 'Invalid or expired refresh token', 403);
      }

      const user = await this.userRepo.findOne({
        _id: decoded.userId,
        'refreshTokens.token': refreshToken,
      });

      if (!user) {
        return this.sendError(res, 'Session expired. Please log in again.', 401);
      }

      const newRefreshToken = TokenService.createRefreshToken(user._id as string);
      const accessToken = TokenService.createAccessToken({
        _id: user._id as string,
        email: user.email as string,
        role: user.role
      });

      await this.userRepo.update(user._id as string, {
        $pull: { refreshTokens: { token: refreshToken } },
      });

      await this.userRepo.update(user._id as string, {
        $push: { refreshTokens: { token: newRefreshToken, createdAt: new Date() } },
      });

      const isProduction = configService.nodeEnv === 'production';
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return this.sendSuccess(res, {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
        },
      }, 'New access token issued');
    } catch (error: any) {
      return this.sendError(res, 'Failed to refresh token', 500, error);
    }
  };

  public logout = async (req: Request, res: Response) => {
    const isProduction = configService.nodeEnv === 'production';
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
      path: '/',
    };

    res.cookie('accessToken', '', { ...options, expires: new Date(0) });
    res.cookie('refreshToken', '', { ...options, expires: new Date(0) });

    return this.sendSuccess(res, {}, 'User logged out successfully');
  };

  public getProfile = async (req: Request, res: Response) => {
    if (req.user) {
      return this.sendSuccess(res, {
        isAuthenticated: true,
        user: req.user,
      }, 'User profile retrieved');
    }

    return this.sendSuccess(res, {
      isAuthenticated: false,
      user: null
    }, 'User not authenticated');
  };

  // Google OAuth methods
  public initiateGoogleAuth = async (req: Request, res: Response, next: NextFunction) => {
    // This will be used as a middleware if needed, but passport usually handles this.
    // For now, we'll keep it as a placeholder if custom logic is needed before redirect.
    next();
  };

  public googleAuthCallback = async (req: Request, res: Response) => {
    try {
      const user = await this.userRepo.findById((req as any).user._id);
      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      const { accessToken, refreshToken } = await this.userRepo.generateAccessAndRefreshToken(user);

      const isProduction = configService.nodeEnv === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      });

      // Simple HTML snippet to post message back to opener (standard practice for popup auth)
      const payload = {
        type: 'authComplete',
        success: true,
        data: { accessToken, user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        } },
      };

      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage(${JSON.stringify(payload)}, "*");
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error: any) {
      return this.sendError(res, 'Google auth callback failed', 500, error);
    }
  };
}

export const authController = new AuthController();
