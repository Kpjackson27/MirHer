'use strict';

//Load the module dependencies
var index = require('../controllers/comingsoon');
	

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/')
		.get(index.render);
};