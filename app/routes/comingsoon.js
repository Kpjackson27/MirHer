'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var comingsoon = require('../controllers/comingsoon');

	//Mount the 'index' controller's 'render' method
	app.get('/comingsoon', comingsoon.render);
};