// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	cloudinary = require('cloudinary'),
	fs = require('fs'),
	News = mongoose.model('News'),
	crypto = require('crypto'),
	multipart = require('connect-multiparty'),
	multipartMiddleware = multipart();

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};


//render the page to create new articles
exports.createNews = function(req, res) {
	if (req.user) {
		res.render('admin/news', {
			title: 'Create News'
		});
	} else
		return res.redirect('/admin');
};

//create a new article
exports.create = function(req, res) {
	// Create a new article object
	var news = new News(req.body);

	var imageFile = req.files.image.path;

	// Set the article's 'creator' property
	news.creator = req.user;

	//Upload file to cloudinary
	cloudinary.uploader.upload(imageFile, {tags:'express_sample'})
	.then(function(image){
		console.log('** file uploaded to Cloudiary service');
		console.dir(image);
		news.image = image;
		//Save photo with image metadata
		return news.save();
	})
	.then(function(news){
		console.log('** photo saved');
	})
	.finally(function(){
		res.render('/admin/news', {news:news, upload : news.image});
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	News.find().sort('-created').populate('creator', 'email profile profile.name').exec(function(err, news) {
		if (err) {
			req.flash('errors', {
				msg: getErrorMessage(err)
			});
			return res.redirect('/admin');
		} else {
			res.format({
				html: function() {
					res.render('admin/allnews', {
						title: 'All News',
						"news": news
					});
				},
				json: function() {
					res.json(news);
				}
			});
		}
	});
};

// returns a single article
exports.read = function(req, res) {
	res.format({
		html: function() {
			res.render('admin/singelnews', {
				title: 'Single news',
				"news": req.news
			});
		},
		json: function() {
			res.json(req.news);
		}
	});
};
// get update page
// exports.getUpdate = function(req, res){
// 	res.format({
// 		html: function() {
// 			res.render('article/edit', {
// 				title: 'Single Poem',
// 				"article": req.article
// 			});
// 		},
// 		json: function() {
// 			res.json(req.article);
// 		}
// 	});

// };

// Create a new controller method that updates an existing article
// exports.update = function(req, res) {
// 	// Get the article from the 'request' object
// 	var article = req.article;

// 	// Update the article fields
// 	article.title = req.body.title;
// 	article.content = req.body.content;

// 	// Try saving the updated article
// 	article.save(function(err) {
// 		if (err) {
// 			// If an error occurs send the error message
// 			return res.status(400).send({
// 				message: getErrorMessage(err)
// 			});
// 		} else {
// 			// Send a JSON representation of the article 
// 			res.json(article);
// 		}
// 	});
// };

// Create a new controller method that delete an existing article
exports.deletePost = function(req, res) {

	News.findById(req.id, function(err, news){
		if(err){
			return console.error(err);
		} else {
			news.remove(function(err){
				if(err){
					req.flash('errors', {msg: 'Failed to delete news.'});
					res.redirect('/admin/allnews');
				} else {
					res.format({
				html: function() {
					res.render('admin/allnews', {
						title: 'All News',
						"news": news
					});
				},
				json: function() {
					res.json({message: 'deleted', news: news
					});
				}
			});
		}
	});
}
});

};


// Create a new controller middleware that retrieves a single existing article
exports.newsByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	News.findById(id).populate('creator', 'email').exec(function(err, news) {
		if (err) return next(err);
		if (!news) {
				req.flash('errors', {
					msg: 'Failed to load news ' + id
				});
				return res.redirect('/');
		}
		// If an article is found use the 'request' object to pass it to the next middleware
		req.news = news;
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.news.creator.id !== req.user.id) {
		// return res.status(403).send({
		// 	message: 'User is not authorized creator'
		// });
		
		req.flash('errors', { msg: 'User is not authorized creator'});
		// return(next(err));
		return res.redirect('/admin/allnews');
	}

	// Call the next middleware
	next();
};
