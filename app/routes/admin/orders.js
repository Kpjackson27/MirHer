'use strict';

//Load the module dependencies
var products = require('../../controllers/admin/orders'),
	passport = require('passport'),
	passportConf = require('../../../config/passport');
	

module.exports = function(app){
	

	app.route('/admin/orders')
		.get(products.orders);

};



