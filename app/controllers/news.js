// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	News = mongoose.model('News');

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


// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	News.find().sort('-created').populate('creator').exec(function(err, news) {
		if (err) {
			req.flash('errors', {
				msg: getErrorMessage(err)
			});
			return res.redirect('/');
		} else {
			res.format({
				html: function() {
					res.render('news/news', {
						title: 'Latest News',
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
			res.render('news/post', {
				title: 'Post',
				"news": req.news
			});
		},
		json: function() {
			res.json(req.news);
		}
	});
};

// Create a new controller middleware that retrieves a single existing article
exports.newsByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	News.findById(id).populate('creator').exec(function(err, news) {
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


