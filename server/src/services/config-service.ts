import dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public get(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
      throw new Error(`Config error: missing key [${key}]`);
    }
    return value;
  }

  public get port(): number {
    return parseInt(this.get('PORT', '5000'), 10);
  }

  public get nodeEnv(): string {
    return this.get('NODE_ENV', 'development');
  }

  public get mongoUri(): string {
    return this.get('MONGO_URI');
  }

  public get clientUrl(): string | undefined {
    return process.env.CLIENT_URL;
  }

  public get accessTokenSecret(): string {
    return this.get('ACCESS_TOKEN_SECRET');
  }

  public get refreshTokenSecret(): string {
    return this.get('REFRESH_TOKEN_SECRET');
  }

  public get accessTokenExpiry(): string {
    return this.get('ACCESS_TOKEN_EXPIRY');
  }

  public get refreshTokenExpiry(): string {
    return this.get('REFRESH_TOKEN_EXPIRY');
  }

  public get cloudinaryCloudName(): string {
    return this.get('CLOUDINARY_CLOUD_NAME');
  }

  public get cloudinaryApiKey(): string {
    return this.get('CLOUDINARY_API_KEY');
  }

  public get cloudinaryApiSecret(): string {
    return this.get('CLOUDINARY_API_SECRET');
  }

  public get resendApiKey(): string {
    return this.get('RESEND_API_KEY');
  }

  public get razorpayKeyId(): string {
    return this.get('RAZORPAY_KEY_ID');
  }

  public get razorpayKeySecret(): string {
    return this.get('RAZORPAY_KEY_SECRET_ID');
  }

  public get apiBaseUrl(): string {
    return this.get('API_BASE_URL');
  }

  public get appName(): string {
    return this.get('APP_NAME', 'Cravo');
  }

  public get companyLogoUrl(): string {
    return this.get('COMPANY_LOGO_URL', 'https://placehold.co/180x60/81C784/FFFFFF?text=YOUR+LOGO');
  }

  public get privacyPolicyUrl(): string {
    return this.get('PRIVACY_POLICY_URL', '#');
  }

  public get termsOfServiceUrl(): string {
    return this.get('TERMS_OF_SERVICE_URL', '#');
  }

  public get productionUrl(): string {
    return this.get('PRODUCTION_URL', 'https://cravo-server.onrender.com');
  }
}

export const configService = ConfigService.getInstance();
