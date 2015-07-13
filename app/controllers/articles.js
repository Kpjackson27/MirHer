// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Article = mongoose.model('Article');

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
exports.getCreateArticles = function(req, res) {
	if (req.user) {
		res.render('article/create', {
			title: 'Create Article'
		});
	} else
		return res.redirect('/');
};

//create a new article
exports.create = function(req, res) {
	// Create a new article object
	var article = new Article(req.body);

	// Set the article's 'creator' property
	article.creator = req.user;

	// Try saving the article
	article.save(function(err) {
		if (err) {
			req.flash('errors', {
				msg: getErrorMessage(err)
			});
			return res.redirect('/api/CreateArticles');
		} else {
			// req.flash('success', { msg: 'Poem created.'});
			return res.redirect('/api/articles');
		}
	});
};

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	Article.find().sort('-created').populate('creator', 'email profile profile.name').exec(function(err, articles) {
		if (err) {
			req.flash('errors', {
				msg: getErrorMessage(err)
			});
			return res.redirect('/');
		} else {
			res.format({
				html: function() {
					res.render('article/listPost', {
						title: 'All Poems',
						"articles": articles
					});
				},
				json: function() {
					res.json(articles);
				}
			});
		}
	});
};

// returns a single article
exports.read = function(req, res) {
	res.format({
		html: function() {
			res.render('article/singlePost', {
				title: 'Single Poem',
				"article": req.article
			});
		},
		json: function() {
			res.json(req.article);
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
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var article = req.article;
	// Use the model 'remove' method to delete the article
	article.remove(function(err) {
		if (err) {
			req.flash('errors', { msg: 'Failed to delete verse.'});
			res.redirect('/api/articles');
		} else {
			 req.flash('success', { msg: 'Verse deleted.'});
			 res.redirect('/api/articles');
			// Send a JSON representation of the article 
			// res.json(article);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.articleByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	Article.findById(id).populate('creator', 'email profile').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
				req.flash('errors', {
					msg: 'Failed to load article ' + id
				});
				return res.redirect('/');
		}
		// If an article is found use the 'request' object to pass it to the next middleware
		req.article = article;
		// console.log('id: ' + req.article.creator.id);
		// console.log('profile: ' + req.article.creator.profile);
		// console.log('profile.name: ' + req.article.creator.profile.name);
		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.article.creator.id !== req.user.id) {
		// return res.status(403).send({
		// 	message: 'User is not authorized creator'
		// });
		
		req.flash('errors', { msg: 'User is not authorized creator'});
		// return(next(err));
		return res.redirect('/api/articles');
	}

	// Call the next middleware
	next();
};
