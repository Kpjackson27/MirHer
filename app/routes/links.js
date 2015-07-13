'use strict';

module.exports = function(app){
	//Load the links controller
	var link = require('../controllers/links');

	app.get('/about', link.about);
	app.get('/careers', link.careers);
	app.get('/faq', link.faq);
	app.get('/contact', link.contact);
	app.get('/look', link.look);
	app.get('/terms', link.terms);
	app.get('/works', link.works);
	app.get('/join', link.join);
	app.get('/news', link.news);
};