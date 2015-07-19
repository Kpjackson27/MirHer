'use strict';

//Load the module dependencies
var news = require('../controllers/news');

module.exports = function(app){
	
		// Set up the 'articles' base routes 
	app.route('/news')
		.get(news.list);
	
	// Single article
	app.route('/news/:newsId')
	   .get(news.read);
	// Set up the 'articleId' parameter middleware   
	app.param('newsId', news.newsByID);


};



