import { Strategy as DiscordStrategy } from 'passport-discord';
import config from '../../config.js';

export default function(passport, client) {
  passport.use(new DiscordStrategy({
    clientID: config.bot.clientId,
    clientSecret: config.bot.clientSecret,
    callbackURL: config.bot.callbackURL,
    scope: ['identify']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}