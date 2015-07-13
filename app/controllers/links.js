'use strict';

//About page controller
exports.about = function(req,res){
	res.render('footer/about', {
		title: 'MirHer | About',
	});
};


//Careers page controller
exports.careers = function(req,res){
	res.render('footer/careers', {
		title: 'MirHer | Careers',
	});
};

//Contact page controller
exports.contact = function(req,res){
	res.render('footer/contact', {
		title: 'MirHer | Contact',
	});
};

//Footer page controller
exports.faq = function(req,res){
	res.render('footer/faq', {
		title: 'MirHer | FAQ',
	});
};

//Join page controller
exports.join = function(req,res){
	res.render('join', {
		title: 'MirHer | Join',
	});
};

//Look page controller
exports.look = function(req,res){
	res.render('look', {
		title: 'MirHer | Look',
	});
};

//News page controller
exports.news = function(req,res){
	res.render('news/news', {
		title: 'MirHer | news',
	});
};

//Terms page controller
exports.terms = function(req,res){
	res.render('footer/terms', {
		title: 'MirHer | Terms',
	});
};

//Works page controller
exports.works = function(req,res){
	res.render('works', {
		title: 'MirHer | Works',
	});
};