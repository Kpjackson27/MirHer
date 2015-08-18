'use strict';

	var shipping = require('../controllers/shipping'),
		passport = require('passport');

	var passportConf = require('../../config/passport');

module.exports = function(app){
	
	app.route('/account/me/shipping')
		//.get(passportConf.isAuthenticated, shipping.render)
		.post(passportConf.isAuthenticated,shipping.addAddress)
		.get(passportConf.isAuthenticated,shipping.getAddress);
};