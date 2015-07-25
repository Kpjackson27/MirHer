'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport');


var passportConf = require('../../config/passport');

//Define the routes module method
module.exports = function(app){
	//setup the 'signup' routes
	app.route('/signup')
		.get(users.getSignup)
		.post(users.postSignup);

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
	app.route('/account')
		.get(passportConf.isAuthenticated, users.getAccount);

	//setup the 'account' routes
	app.route('/settings')
		.get(passportConf.isAuthenticated, users.settings);

	//setup the 'account' routes
	app.route('/mystylist')
		.get(passportConf.isAuthenticated, users.mystylist);

	//setup the 'account' routes
	app.route('/request')
		.get(passportConf.isAuthenticated, users.request);


	//setup the 'account' routes
	app.route('/texture')
		.get(passportConf.isAuthenticated, users.texture);
		//setup the 'account' routes
	app.route('/lengths')
		.get(passportConf.isAuthenticated, users.lengths);

			//setup the 'account' routes
	app.route('/extras')
		.get(passportConf.isAuthenticated, users.extras);

			//setup the 'account' routes
	app.route('/finalize')
		.get(passportConf.isAuthenticated, users.finalize);

	//setup the 'mirher' routes
	app.route('/mymirher')
		.get(passportConf.isAuthenticated, users.getMyMirher);

	//setup the 'account profile' routes
	app.route('/account/profile')
		.post(passportConf.isAuthenticated, users.postUpdateProfile);

	//setup the 'account password' routes
	app.route('/account/password')
		.post(passportConf.isAuthenticated, users.postUpdatePassword);	

	//setup the 'account delete' routes
	app.route('/account/delete')
		.post(passportConf.isAuthenticated, users.postDeleteAccount);
	
	app.route('/account/unlink/:provider')
		.get(passportConf.isAuthenticated, users.getOauthUnlink);
};