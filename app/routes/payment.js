'use strict';

	var payment = require('../controllers/payment'),
		passport = require('passport');

	var passportConf = require('../../config/passport');

module.exports = function(app){
	
	app.route('/account/me/payment')
		.get(passportConf.isAuthenticated, payment.render);
};