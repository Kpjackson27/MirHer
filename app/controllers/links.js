'use strict';

var mongoose = require('mongoose'),
    cloudinary = require('cloudinary'),
    Product = mongoose.model('Products');
    
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
/*
exports.look = function(req,res){
	res.render('look', {
		title: 'MirHer | Look',
	});
};
*/

exports.look = function(req, res) {
    // var page = (req.param('page') > 0 ? req.param('page'):1) - 1;
    // var perPage = 15;
    // var options = {
    // perPage: perPage,
    // page: page
    // };

    // Use the model 'find' method to get a list of articles
    Product.find().sort('-created').exec(function(err, products) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/');
        } else {
            console.log(products);
            res.format({
                html: function() {
                    res.render('look', {
                        title: 'MirHer | Look',
                        "products": products
                    });
                },
                json: function() {
                    res.json(products);
                }
            });
        }
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