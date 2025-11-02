const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      
      if (!user.avatar && profile.photos && profile.photos[0]) {
        user.avatar = profile.photos[0].value;
        await user.save();
      }
      return done(null, user);
    }
    
    // Check if user with this email already exists
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // User exists with different provider, update with Google ID
      user.googleId = profile.id;
      user.name = profile.displayName;
      if (profile.photos && profile.photos[0] && !user.avatar) {
        user.avatar = profile.photos[0].value;
      }
      user.provider = 'google';
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      provider: 'google'
    });
    
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
     
      if (!user.avatar && profile.photos && profile.photos[0]) {
        user.avatar = profile.photos[0].value;
        await user.save();
      }
      return done(null, user);
    }
    
    // Check if user with this email already exists
    if (profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // User exists with different provider, update with Facebook ID
        user.facebookId = profile.id;
        user.name = profile.displayName;
        if (!user.avatar && profile.photos && profile.photos[0]) {
          user.avatar = profile.photos[0].value;
        } else if (!user.avatar && profile._json && profile._json.picture && profile._json.picture.data) {
          user.avatar = profile._json.picture.data.url;
        }
        user.provider = 'facebook';
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    let avatarUrl = null;
    if (profile.photos && profile.photos[0]) {
      avatarUrl = profile.photos[0].value;
    } else if (profile._json && profile._json.picture && profile._json.picture.data) {
      avatarUrl = profile._json.picture.data.url;
    }
    
    user = await User.create({
      facebookId: profile.id,
      email: profile.emails ? profile.emails[0].value : null,
      name: profile.displayName,
      avatar: avatarUrl,
      provider: 'facebook'
    });
    
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
  
    
    if (user) {
     
      if (!user.avatar && profile._json && profile._json.avatar_url) {
        user.avatar = profile._json.avatar_url;
        await user.save();
      }
      return done(null, user);
    }
    
    // Check if user with this email already exists
    if (profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // User exists with different provider, update with GitHub ID
        user.githubId = profile.id;
        user.name = profile.displayName || profile.username;
        if (!user.avatar && profile._json && profile._json.avatar_url) {
          user.avatar = profile._json.avatar_url;
        }
        user.provider = 'github';
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    const avatarUrl = profile._json && profile._json.avatar_url ? profile._json.avatar_url : null;
    
    user = await User.create({
      githubId: profile.id,
      email: profile.emails ? profile.emails[0].value : null,
      name: profile.displayName || profile.username,
      avatar: avatarUrl,
      provider: 'github'
    });
    
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;