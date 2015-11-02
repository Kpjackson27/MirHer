'use strict';

//Load the module dependencies
var products = require('../../controllers/admin/products'),
	cloudinary = require('cloudinary'),
	passport = require('passport'),
	passportConf = require('../../../config/passport');
	

module.exports = function(app){
	

	app.route('/admin/products')
		.get(products.products);

	app.route('/admin/addproducts')
		.get(products.addProducts, passportConf.isAuthenticated)
		.post(products.create, passportConf.isAuthenticated);

};



