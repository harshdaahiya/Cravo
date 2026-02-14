import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user-model.js';
import { UserService } from '../services/user-service.js';
import { configService } from '../services/config-service.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: configService.get('GOOGLE_CLIENT_ID'),
        clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
        callbackURL: `${configService.apiBaseUrl}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await UserModel.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          const userByEmail = await UserModel.findOne({
            email: profile.emails?.[0].value,
          });
          
          if (userByEmail) {
            userByEmail.googleId = profile.id;
            await userByEmail.save();
            return done(null, userByEmail);
          }

          const newUser = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            isVerified: true,
          } as any);

          await UserService.createDefaultLists(newUser._id as string);
          
          done(null, newUser);
        } catch (error) {
          done(error as any, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
