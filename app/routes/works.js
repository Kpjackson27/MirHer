'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var works = require('../controllers/works');

	//Mount the 'index' controller's 'render' method
	app.get('/works', works.render);
};