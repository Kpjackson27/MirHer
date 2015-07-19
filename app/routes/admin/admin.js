'use strict';

//Load the module dependencies
var admin = require('../../controllers/admin/admin'),
	users = require('../../controllers/users'),
	news = require('../../controllers/admin/news'),
	passport = require('passport'),
	passportConf = require('../../../config/passport');
	

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/admin')
		.get(admin.main);

		// Set up the 'articles' base routes 
	app.route('/admin/news')
		.get(news.createNews)
		.post(passportConf.isAuthenticated, news.create);
	app.route('/admin/allnews')
	   	.get(news.list);
	
	// Single article
	app.route('/api/news/:newsId')
	   .get(news.read);
	// Set up the 'articleId' parameter middleware   
	app.param('newsId', news.newsByID);

	//app.post('/uploads', articles.uploadImage);


	app.route('/admin/portfolio')
	   	.get(admin.portfolio);

	app.route('/upload')
		.post(admin.upload);

};



