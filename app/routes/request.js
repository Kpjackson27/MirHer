'use strict';

	var request = require('../controllers/request'),
		passport = require('passport');

	var passportConf = require('../../config/passport');

module.exports = function(app){
	
	app.route('/account/me/request')
		.get(passportConf.isAuthenticated,request.render);
};