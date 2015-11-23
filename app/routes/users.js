'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
    passport = require('passport');


var passportConf = require('../../config/passport');
var cloudinary = require('cloudinary');
var User = require('mongoose').model('User');
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};
//Define the routes module method
module.exports = function(app) {
    //setup the 'signup' routes
    app.route('/signup')
        .get(users.getSignup)
        .post(users.postSignup);

    app.route('/account/createmirher')
        .get(passportConf.isAuthenticated, users.createmirher);

    app.route('/account/createmirher/name')
        .get(passportConf.isAuthenticated, users.addName)
        .post(passportConf.isAuthenticated, users.postUpdateName);

    app.route('/account/createmirher/age')
        .get(passportConf.isAuthenticated, users.getAge)
        .post(passportConf.isAuthenticated, users.postAge);

    app.route('/account/createmirher/hairtype')
        .get(passportConf.isAuthenticated, users.hairtype)
        .post(passportConf.isAuthenticated, users.postHairType);

    app.route('/account/createmirher/hairhealth')
        .get(passportConf.isAuthenticated, users.hairhealth)
        .post(passportConf.isAuthenticated, users.postHairHealth);

    app.route('/account/createmirher/hairlength')
        .get(passportConf.isAuthenticated, users.hairlength)
        .post(passportConf.isAuthenticated, users.postHairLength);

    app.route('/account/createmirher/hairchallenges')
        .get(passportConf.isAuthenticated, users.hairchallenges)
        .post(passportConf.isAuthenticated, users.postHairChallenges);

    app.route('/account/createmirher/hairtexture')
        .get(passportConf.isAuthenticated, users.hairtexture)
        .post(passportConf.isAuthenticated, users.postHairTexture);

    app.route('/account/createmirher/rateofpurchase')
        .get(passportConf.isAuthenticated, users.rateofpurchase)
        .post(passportConf.isAuthenticated, users.postRateOfPurchase);

    app.route('/account/createmirher/quantityofpurchase')
        .get(passportConf.isAuthenticated, users.quantityofpurchase)
        .post(passportConf.isAuthenticated, users.postNumberOfBundles);

    app.route('/account/createmirher/customunits')
        .get(passportConf.isAuthenticated, users.customunits)
        .post(passportConf.isAuthenticated, users.postCustomUnits);

    app.route('/account/createmirher/frontals')
        .get(passportConf.isAuthenticated, users.frontals)
        .post(passportConf.isAuthenticated, users.postFrontals);

    app.route('/account/createmirher/frequency')
        .get(passportConf.isAuthenticated, users.frequency)
        .post(passportConf.isAuthenticated, users.postHairFrequency);

    app.route('/account/createmirher/colors')
        .get(passportConf.isAuthenticated, users.colors)
        .post(passportConf.isAuthenticated, users.postColors);

    app.route('/account/createmirher/products')
        .get(passportConf.isAuthenticated, users.products)
        .post(passportConf.isAuthenticated, users.postProducts);

    app.route('/account/createmirher/complete')
        .get(passportConf.isAuthenticated, users.congrats);

    //setup the 'login routes'
    app.route('/login')
        .get(users.getLogin)
        .post(users.postLogin);

    app.route('/logout')
        .get(users.logout);

    //setup the 'forgot password' routes
    app.route('/forgot')
        .get(users.getForgot)
        .post(users.getForgot);

    //setup the 'reset' routes
    app.route('/reset/:token')
        .get(users.getReset)
        .post(users.postReset);

    //setup the 'account' routes
    app.route('/account/me/profile')
        .get(passportConf.isAuthenticated, users.getAccount);


    //setup the 'account' routes
    app.route('/account/me/editprofile')
        .get(passportConf.isAuthenticated, users.editprofile)
        .post(passportConf.isAuthenticated, users.postUpdateProfile);

    //setup the 'account' routes
    app.route('/account/me/shipping')
        .get(passportConf.isAuthenticated, users.getShipping)
        .get(passportConf.isAuthenticated, users.showShipping)
        .post(passportConf.isAuthenticated, users.postShipping);

    //setup the 'account' routes
    app.route('/mystylist')
        .get(passportConf.isAuthenticated, users.mystylist);

    //setup the 'account' routes
    app.route('/account/order/selecttype')
        .get(passportConf.isAuthenticated, users.selecttype);

    //setup the 'account' routes
    app.route('/account/order/selecttexture')
        .get(passportConf.isAuthenticated, users.texture);
    //setup the 'account' routes
    app.route('/account/order/selectlengths')
        .get(passportConf.isAuthenticated, users.lengths);

    //setup the 'account' routes
    app.route('/account/order/selectextra')
        .get(passportConf.isAuthenticated, users.extras);

    //setup the 'account' routes
    app.route('/account/order/finalize')
        .get(passportConf.isAuthenticated, users.finalize);

    //setup the 'mirher' routes
    app.route('/mymirher')
        .get(passportConf.isAuthenticated, users.getMyMirher);

    //setup the 'account profile' routes
    //app.route('/account/settings/profile')
    //	.post(passportConf.isAuthenticated, users.postUpdateProfile);

    //setup the 'account password' routes
    app.route('/account/password')
        .post(passportConf.isAuthenticated, users.postUpdatePassword);

    //setup the 'account delete' routes
    app.route('/account/delete')
        .post(passportConf.isAuthenticated, users.postDeleteAccount);

    app.route('/account/unlink/:provider')
        .get(passportConf.isAuthenticated, users.getOauthUnlink);
    /**
     * OAuth authentication routes. (Sign in)
     */
    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback', passport.authenticate('instagram', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account/me/profile');
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_location']
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account/me/profile');
    });
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account/me/profile');
    });
    app.post('/profile/images', passportConf.isAuthenticated, users.uploadProfieImg);
        //setup the 'account' routes
    app.route('/account/me/referral')
        .get(passportConf.isAuthenticated, users.referral)
        .post(passportConf.isAuthenticated, users.postReferral);

};