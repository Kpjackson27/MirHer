'use strict';

var _ = require('lodash'),
    async = require('async'),
    crypto = require('crypto'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    User = require('../models/User'),
    Article = require('../models/News'),
    secrets = require('../../config/secrets'),
    sendgrid = require('sendgrid')(secrets.sendgrid.apiKey);

var cloudinary = require('cloudinary');


// Create a new error handling controller method
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.uploadProfieImg = function(req, res) {
    console.log(req.files.file.path);
    cloudinary.uploader.upload(
        req.files.file.path, //file.path: file path on the server, need to delete folder files
        function(result) {
            //cloudinary url for thumb
            var newUrl = cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                crop: 'thumb',
                gravity: 'face',
                radius: '25'
            });
            // console.log('newUrl: ' + newUrl);
            User.findById(req.user.id).exec(function(err, user) {
                if (err) {
                    // Use the error handling method to get the error message
                    var message = getErrorMessage(err);
                    console.log(message);
                    // Set the flash messages
                    // req.flash('error', message);
                    return res.redirect('/');
                }
                user.profile.picture = newUrl;
                // user.profile.cloudinaryUrl = newUrl;
                user.save(function(err) {
                    if (err) {
                        // Use the error handling method to get the error message
                        var message = getErrorMessage(err);
                        console.log(message);
                        // Set the flash messages
                        // req.flash('error', message);
                        return res.redirect('/main');
                    } else {
                        res.redirect('/account/me/profile');
                    }
                });
            });
        }
        // ,{
        //  // public_id:req.files.file.name, 
        //  crop: 'limit',
        //  width: 2000,
        //  height: 2000,
        //  eager: [
        //  { width: 200, height: 200, crop: 'thumb', gravity: 'face',
        //    radius: 20, effect: 'sepia' },
        //  { width: 100, height: 150, crop: 'fit', format: 'png' }
        //  ],                                     
        //  tags: ['special', 'for_homepage']
        // }
    );

};
/**
 *GET /login
 * Login Page
 */
exports.getLogin = function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('account/login', {
        title: 'Login'
    });
};

/**
 * POST /login
 * Sign in using email and password
 */
exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('errors', {
                msg: info.message
            });
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Welcome back!'
            });
            res.redirect(req.session.returnTo || '/mymirher');
        });
    })(req, res, next);
};

/**
 *GET /logout
 *Log out
 */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * GET /mymirher
 * My MirHer Page
 */
exports.getMyMirher = function(req, res) {
    res.render('account/mymirher', {
        title: 'My MirHer'
    });
};

/**
 * GET /signup
 * Signup Page
 */
exports.getSignup = function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('account/signup', {
        title: 'Create Account'
    });
};




/**
 * POST /signup
 * Create a new local account
 */
exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });


    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (existingUser) {
            req.flash('errors', {
                msg: 'Account with that email address already exists.'
            });
            return res.redirect('/signup');
        }
        user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.redirect('/account/createmirher');
            });
        });
    });
};

/**
 * GET list of users
 *
 */
// Create a new controller method that retrieves a list of articles
exports.showUsers = function(req, res) {
    // Use the model 'find' method to get a list of articles
    User.find().sort('-created').exec(function(err, users) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/');
        } else {
            res.format({
                html: function() {
                    res.render('admin/users', {
                        title: 'List of Users',
                        "users": users
                    });
                },
                json: function() {
                    res.json(users);
                }
            });
        }
    });
};
/** GET list of users**/

/**
 *GET /account
 * 
 */
exports.getAccount = function(req, res) {
    res.render('account/profile', {
        title: 'Account Management'
    });
};

/***************************************
 * User settings
 * 1-Profile Information
 * 2-Shipping Information
 * 3-Credit Card Information
 ****************************************/

/**************SETTINGS****************/

/**
 *Get settings page
 *
 */
exports.editprofile = function(req, res) {
    res.render('account/editprofile', {
        title: 'Edit Profile'
    });
};


/**************SETTINGS/PROFILE END****************/
/**
 * Create New User Profile Information
 *
 */

/**
 * Update User Profile Information
 *
 */

/**
 * Delete User Profile Information
 *
 */

/**
 * Show User Profile Information
 *
 */

/**
 * Update User Profile Information
 *
 */
exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.firstname = req.body.firstname || '';
        user.profile.lastname = req.body.lastname || '';
        user.profile.phonenumber = req.body.phonenumber || '';
        user.email = req.body.email || '';
        user.profile.facebook = req.body.facebook || '';
        user.profile.twitter = req.body.twitter || '';
        user.profile.instagram = req.body.instagram || '';
        user.profile.pinterest = req.body.pinterest || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/me/profile');
        });
    });
};
/**************SETTINGS/PROFILE END****************/

/**************SETTINGS/CREDIT CARD****************/

/**
 * Create New User Credit Card Information
 *
 */

/**
 * Update User Credit Card Information
 *
 */

/**
 * Delete User Credit Card Information
 *
 */

/**
 * Show User Credit Card  Information
 *
 */

/**
 * Update User Credit Card Information
 *
 */
/**************SETTINGS/CREDIT CARD END****************/

/**************SETTINGS END****************/



/**
 *Get stylist page
 *
 */
exports.mystylist = function(req, res) {
    res.render('account/mystylist', {
        title: 'My Stylist'
    });
};

/**************ORDER INFORMATION***************/

exports.selecttype = function(req, res) {
    res.render('account/order/selecttype', {
        title: 'Select Type'
    });
};

exports.texture = function(req, res) {
    res.render('account/order/selecttexture', {
        title: 'Select Texture'
    });
};


exports.lengths = function(req, res) {
    res.render('account/order/selectlengths', {
        title: 'Select Length'
    });
};

exports.extras = function(req, res) {
    res.render('account/order/selectextra', {
        title: 'Extras'
    });
};

exports.finalize = function(req, res) {
    res.render('account/order/finalize', {
        title: 'Finalize Chest'
    });
};

/**************ORDER INFORMATION END***************/

/**************CREATE MIRHER***************/

exports.createmirher = function(req, res) {
    res.render('account/createmirher', {
        title: 'Create Your Mirher'
    });
};

exports.addName = function(req, res) {
    res.render('account/createmirher/name', {
        title: 'Create Your Mirher'
    });
};

/**
 *POST /account/profile
 *Profile Page
 */
exports.postUpdateName = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.firstname = req.body.firstname || '';
        user.profile.lastname = req.body.lastname || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/age');
        });
    });
};

exports.getAge = function(req, res) {
    res.render('account/createmirher/age', {
        title: 'Select Age Group'
    });
};

exports.postAge = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.age = req.body.age || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/hairtype');
        });
    });
};


exports.hairtype = function(req, res) {
    res.render('account/createmirher/hairtype', {
        title: 'Select Hair Type'
    });
};

exports.postHairType = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.hairtype = req.body.hairtype || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/hairhealth');
        });
    });
};



exports.hairhealth = function(req, res) {
    res.render('account/createmirher/hairhealth', {
        title: 'Hair Health'
    });
};

exports.postHairHealth = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.hairhealth = req.body.hairhealth || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/hairchallenges');
        });
    });
};

exports.hairchallenges = function(req, res) {
    res.render('account/createmirher/hairchallenges', {
        title: 'Hair Challenges'
    });
};

exports.postHairChallenges = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.hairchallenges = req.body.hairchallenges || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/frequency');
        });
    });
};

exports.frequency = function(req, res) {
    res.render('account/createmirher/weavefrequency', {
        title: 'Weave Frequency'
    });
};

exports.postHairFrequency = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.weavefrequency = req.body.weavefrequency || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/rateofpurchase');
        });
    });
};



exports.rateofpurchase = function(req, res) {
    res.render('account/createmirher/rateofpurchase', {
        title: 'Rate of Purchase'
    });
};

exports.postRateOfPurchase = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.rateofpurchase = req.body.rateofpurchase || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/hairlength');
        });
    });
};



exports.hairlength = function(req, res) {
    res.render('account/createmirher/hairlength', {
        title: 'Hair Length'
    });
};

exports.postHairLength = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.hairlength = req.body.hairlength || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/hairtexture');
        });
    });
};

exports.hairtexture = function(req, res) {
    res.render('account/createmirher/hairtexture', {
        title: 'Hair Texture'
    });
};

exports.postHairTexture = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.hairtexture = req.body.hairtexture || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/quantityofpurchase');
        });
    });
};


exports.quantityofpurchase = function(req, res) {
    res.render('account/createmirher/quantityofpurchase', {
        title: 'Quantity of Purchase'
    });
};


exports.postNumberOfBundles = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.numberofbundles = req.body.numberofbundles || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/customunits');
        });
    });
};

exports.customunits = function(req, res) {
    res.render('account/createmirher/customunits', {
        title: 'Custom Units'
    });
};

exports.postCustomUnits = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.customunits = req.body.customunits || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/frontals');
        });
    });
};

exports.frontals = function(req, res) {
    res.render('account/createmirher/frontals', {
        title: 'Frontals/Closures'
    });
};

exports.postFrontals = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.frontals = req.body.frontals || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/colors');
        });
    });
};
exports.colors = function(req, res) {
    res.render('account/createmirher/color', {
        title: 'Colors'
    });
};

exports.postColors = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.colors = req.body.colors || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/products');
        });
    });
};

exports.products = function(req, res) {
    res.render('account/createmirher/products', {
        title: 'Products/Tools'
    });
};

exports.postProducts = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.profile.products = req.body.products || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account/createmirher/complete');
        });
    });
};

exports.congrats = function(req, res) {
    res.render('account/createmirher/complete', {
        title: 'Complete'
    });
};


/**************CREATE MIRHER END***************/







/**************SETTINGS/SHIPPING****************/

/**
 * Create New User Shipping Information
 *
 */

exports.postShipping = function(req, res, next) {

    req.assert('street', 'Street Address cannot be blank').notEmpty();
    req.assert('city', 'City cannot be blank').notEmpty();
    req.assert('state', 'State cannot be blank').notEmpty();
    req.assert('zip', 'Zip Code cannot be blank').notEmpty();
    // req.assert('country', 'Country cannot be blank').notEmpty();

    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        var shipping = {};
        shipping.street = req.body.street;
        // shipping.unit = req.body.unit;
        shipping.city = req.body.city;
        shipping.state = req.body.state;
        shipping.zip = req.body.zip;
        // shipping.country = req.body.country;
        var s = JSON.stringify(shipping);
        console.log(s);
        var duplicatedShipping = 0;
        for (var i in user.shippings) {
            console.log(JSON.stringify(user.shippings[i]));
            if (JSON.stringify(user.shippings[i]) == s) {
                duplicatedShipping = 1;
                break;
            }
        }
        if (duplicatedShipping === 0) {
            user.shippings.push(shipping);
        }
        user.save(function(err) {
            if (err) return next(err);
            console.log(user.shippings);
            req.flash('success', {
                msg: 'Shipping Address Added'
            });
            res.redirect('/account/me/shipping');
        });

    });
};



/**
 * Update User Shipping Information
 *
 */


/**
 * Delete User Shipping Information
 *
 */

/**
 * Show User Shipping Information
 *
 */
exports.showShipping = function(req, res) {
    // Use the model 'find' method to get a list of articles
    User.find().sort('-created').populate('shippings').exec(function(err, users) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/');
        } else {
            res.format({
                html: function() {
                    res.render('account/me/shipping', {
                        title: 'Shipping',
                        "users": users
                    });
                },
                json: function() {
                    res.json(users);
                }
            });
        }
    });
};





/**
 *GET /account
 * 
 */
exports.getShipping = function(req, res) {
    res.render('account/shipping', {
        title: 'MirHer | Shipping'
    });
};



/**
 * Update User Shipping Information
 *
 */
/**************SETTINGS/SHIPPING****************/




/**
 * POST /acount/password
 * Update current password
 */
exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('account');
    }
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user.password = req.body.password;

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Password has been changed.'
            });
            res.redirect('/account/me/profile');
        });
    });
};
/**
 * POST /account/delete
 *Delete user account
 */
exports.postDeleteAccount = function(req, res, next) {
    User.remove({
        _id: req.user.id
    }, function(err) {
        if (err) return next(err);
        req.logout();
        req.flash('info', {
            msg: 'Your account has been deleted.'
        });
        res.redirect('/');
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
    var provider = req.params.provider;
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user[provider] = undefined;
        user.tokens = _.reject(user.tokens, function(token) {
            return token.kind === provider;
        });

        user.save(function(err) {
            if (err) return next(err);
            req.flash('info', {
                msg: provider + ' account has been unlinked.'
            });
            res.redirect('/account/me/profile');
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User
        .findOne({
            resetPasswordToken: req.params.token
        })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                req.flash('errors', {
                    msg: 'Password reset token is invalid or has expired.'
                });
                return res.redirect('/forgot');
            }
            res.render('account/reset', {
                title: 'Password Reset'
            });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }

    async.waterfall([
        function(done) {
            User
                .findOne({
                    resetPasswordToken: req.params.token
                })
                .where('resetPasswordExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        req.flash('errors', {
                            msg: 'Password reset token is invalid or has expired.'
                        });
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        if (err) return next(err);
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        },
        function(user, done) {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: secrets.sendgrid.user,
                    pass: secrets.sendgrid.password
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Your Hackathon Starter password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('success', {
                    msg: 'Success! Your password has been changed.'
                });
                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: 'Forgot Password'
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.email.toLowerCase()
            }, function(err, user) {
                if (!user) {
                    req.flash('errors', {
                        msg: 'No account with that email address exists.'
                    });
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: secrets.sendgrid.user,
                    pass: secrets.sendgrid.password
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Reset your password on Hackathon Starter',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('info', {
                    msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                });
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
};
exports.referral = function(req, res) {
    res.render('account/referral', {
        title: 'referral'
    });
};
exports.postReferral = function(req, res) {
    req.assert('email', 'Email is not valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account/me/profile');
    }
    // req.flash('email', req.body.email);
    var payload = {
        to: req.body.email,
        from: req.user.email,
        subject: 'Hi',
        text: "I've discovered the best-kept secret in luxury beauty — and I think you're going to love it as much as I do. Check out mirher.com, and get $10 when using the code: " + req.user._id
    };
    sendgrid.send(payload, function(err, json) {
        if (err) {
            console.error(err);
        }
        console.log(json);
    });
    req.flash('success', {
        msg: 'Your referral Email is sent. Thank you.'
    });
    return res.redirect('/mymirher');

};