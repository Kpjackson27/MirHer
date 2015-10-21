'use strict';

//Load the module dependencies
var _ = require('lodash'),
    passport = require('passport'),
    ConnectRoles = require('connect-roles'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    InstagramStrategy = require('passport-instagram').Strategy,
    User = require('../app/models/User');

    var secrets = require('./secrets');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var user = new ConnectRoles();
/** 
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({
            facebook: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                console.log('User is already loggedin. There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
                req.flash('errors', {
                    msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                console.log('User is already loggedin. Link new OAuth account with currently logged-in user.');
                User.findById(req.user.id, function(err, user) {
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.save(function(err) {
                        req.flash('info', {
                            msg: 'Facebook account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            facebook: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({
                email: profile._json.email
            }, function(err, existingEmailUser) {
                if (existingEmailUser) {
                    console.log('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.');
                    req.flash('errors', {
                        msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'
                    });
                    done(err);
                } else {
                    var user = new User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken: accessToken
                    });
                    user.profile.name = profile.displayName;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                    user.save(function(err) {
                        done(err, user);
                    });
                }
            });
        });
    }
}));

// Sign in with Twitter.

passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
    if (req.user) {
        User.findOne({
            twitter: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.twitter = profile.id;
                    user.tokens.push({
                        kind: 'twitter',
                        accessToken: accessToken,
                        tokenSecret: tokenSecret
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.location = user.profile.location || profile._json.location;
                    user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
                    user.save(function(err) {
                        req.flash('info', {
                            msg: 'Twitter account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });

    } else {
        User.findOne({
            twitter: profile.id
        }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);
            var user = new User();
            // Twitter will not provide an email address.  Period.
            // But a person’s twitter username is guaranteed to be unique
            // so we can "fake" a twitter email address as follows:
            user.email = profile.username + "@twitter.com";
            user.twitter = profile.id;
            user.tokens.push({
                kind: 'twitter',
                accessToken: accessToken,
                tokenSecret: tokenSecret
            });
            user.profile.name = profile.displayName;
            user.profile.location = profile._json.location;
            user.profile.picture = profile._json.profile_image_url_https;
            user.save(function(err) {
                done(err, user);
            });
        });
    }
}));

/**
 * Sign in with Instagram.
 */
passport.use(new InstagramStrategy(secrets.instagram, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({
            instagram: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already an Instagram account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.instagram = profile.id;
                    user.tokens.push({
                        kind: 'instagram',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.picture = user.profile.picture || profile._json.data.profile_picture;
                    user.profile.website = user.profile.website || profile._json.data.website;
                    user.save(function(err) {
                        req.flash('info', {
                            msg: 'Instagram account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            instagram: profile.id
        }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);

            var user = new User();
            user.instagram = profile.id;
            user.tokens.push({
                kind: 'instagram',
                accessToken: accessToken
            });
            user.profile.name = profile.displayName;
            // Similar to Twitter API, assigns a temporary e-mail address
            // to get on with the registration process. It can be changed later
            // to a valid e-mail address in Profile Management.
            user.email = profile.username + "@instagram.com";
            user.profile.website = profile._json.data.website;
            user.profile.picture = profile._json.data.profile_picture;
            user.save(function(err) {
                done(err, user);
            });
        });
    }
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
  	return next();
  }
  return res.redirect('/');
};

user.use(function(req, action){
  if(!req.isAuthenticated()) return action === 'access home page';
});
/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    return res.redirect('/auth/' + provider);
  }
};