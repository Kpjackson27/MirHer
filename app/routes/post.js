'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var post = require('../controllers/post');

	//Mount the 'index' controller's 'render' method
	app.get('/post', post.render);
};