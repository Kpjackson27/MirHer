'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var orders = require('../controllers/orders');

	//Mount the 'index' controller's 'render' method
	app.get('/orders', orders.render);
};