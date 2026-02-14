import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { LoggerService } from './services/logger-service.js';
import { ConfigService } from './services/config-service.js';
import { authRouter } from './routes/auth-router.js';
import { categoryRouter } from './routes/category-router.js';
import { productRouter } from './routes/product-router.js';
import { restaurantRouter } from './routes/restaurant-router.js';
import { cartRouter } from './routes/cart-router.js';
import { addressRouter } from './routes/address-router.js';
import { orderRouter } from './routes/order-router.js';
import { cityRouter } from './routes/city-router.js';
import { couponRouter } from './routes/coupon-router.js';
import { reviewRouter } from './routes/review-router.js';
import { listRouter } from './routes/list-router.js';
import { restaurantListRouter } from './routes/restaurant-list-router.js';
import { landingRouter } from './routes/landing-router.js';
import { locationRouter } from './routes/location-router.js';
import { paymentRouter } from './routes/payment-router.js';
import { restaurantSuperAdminRouter } from './routes/super-admin/restaurant-super-admin-router.js';
import { configurePassport } from './config/passport-config.js';
import { errorHandler } from './middlewares/error-middleware.js';
import { keepAlive } from './services/keep-alive-service.js';

export class App {
  public app: Application;
  private config: ConfigService;

  constructor(config: ConfigService) {
    this.app = express();
    this.config = config;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    configurePassport();
    this.initializeProductionLogic();
  }

  private initializeMiddlewares(): void {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      this.config.clientUrl,
    ].filter(Boolean) as string[];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error('Not allowed by CORS: ' + origin));
        },
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(express.static(path.resolve('./public')));
  }

  private initializeRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Hello from Cravo Server' });
    });

    this.app.use('/api/v1/auth', authRouter.router);
    this.app.use('/api/v1/categories', categoryRouter.router);
    this.app.use('/api/v1/products', productRouter.router);
    this.app.use('/api/v1/restaurants', restaurantRouter.router);
    this.app.use('/api/v1/cart', cartRouter.router);
    this.app.use('/api/v1/address', addressRouter.router);
    this.app.use('/api/v1/orders', orderRouter.router);
    this.app.use('/api/v1/cities', cityRouter.router);
    this.app.use('/api/v1/coupons', couponRouter.router);
    this.app.use('/api/v1/reviews', reviewRouter.router);
    this.app.use('/api/v1/lists', listRouter.router);
    this.app.use('/api/v1/restaurantList', restaurantListRouter.router);
    this.app.use('/api/v1/landingResources', landingRouter.router);
    this.app.use('/api/v1/location', locationRouter.router);
    this.app.use('/api/v1/payments', paymentRouter.router);
    this.app.use('/api/v1/super-admin/restaurants', restaurantSuperAdminRouter.router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeProductionLogic(): void {
    if (this.config.nodeEnv === 'production') {
      keepAlive(this.config.productionUrl);
    }
  }

  public listen(): void {
    const port = this.config.port;
    this.app.listen(port, () => {
      LoggerService.info(`Server is running at port : ${port}`);
    });
  }
}
