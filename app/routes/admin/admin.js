'use strict';

//Load the module dependencies
var admin = require('../../controllers/admin/admin'),
	users = require('../../controllers/users'),
	news = require('../../controllers/admin/news'),
	cloudinary = require('cloudinary'),
	passport = require('passport'),
	passportConf = require('../../../config/passport');
	

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/admin')
		.get(admin.main);

		// Set up the 'articles' base routes 
	app.route('/admin/news')
		.get(news.createNews)
		.post(news.create);
	app.route('/admin/allnews')
	   	.get(news.list);
	
	// Single article
	app.route('/api/news/:newsId')
	   .get(news.read);

	 // Single article
	app.route('/api/news/:newsId')
	   .delete(news.deletePost);
	// Set up the 'articleId' parameter middleware   
	app.param('newsId', news.newsByID);

	//app.post('/uploads', articles.uploadImage);
	app.route('/admin/users')
		.get(users.showUsers);

	/*app.post('/hair/image', passportConf.isAuthenticated, function(req,res){
		console.log(req.files.file.path);
		cloudinary.uploader.upload(
			req.files.file.path,
			function(result){
				var newUrl = cloudinary.url(result.public_id, {
					width: 100,
					height: 100,
					crop: 'thumb',
					gravity: 'face',
					radius: '25'
				});
				User.findById
			})
	})
*/
};



