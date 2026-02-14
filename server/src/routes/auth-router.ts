import { authController } from '../controllers/auth-controller.js';
import { BaseRouter } from './base-router.js';
import { checkAuth, isLoggedIn } from '../middlewares/auth-middleware.js';
import passport from 'passport';

export class AuthRouter extends BaseRouter {
  protected initializeRoutes(): void {
    this.router.post('/login', authController.login);
    this.router.post('/register', authController.register);
    this.router.post('/logout', checkAuth, isLoggedIn, authController.logout);
    this.router.get('/profile', checkAuth, authController.getProfile);
    this.router.post('/verify', authController.verifyOTP);
    this.router.post('/refresh', authController.refreshAccessToken);

    // Google OAuth Routes
    this.router.get('/google', (req, res, next) => {
      const clientOrigin = (req.query.origin as string) || (req.get('origin') as string);
      const state = Buffer.from(JSON.stringify({ origin: clientOrigin })).toString('base64');
      
      passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state
      })(req, res, next);
    });

    this.router.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/', session: false }),
      authController.googleAuthCallback
    );
  }
}

export const authRouter = new AuthRouter();
