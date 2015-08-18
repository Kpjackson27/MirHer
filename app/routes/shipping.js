'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var shipping = require('../controllers/shipping');

	//Mount the 'index' controller's 'render' method
	app.get('/account/me/shipping', shipping.render);
};