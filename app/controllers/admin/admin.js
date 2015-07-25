'use strict';

var cloudinary = require('cloudinary').v2,
	fs = require('fs');

//Create a new 'render' controller method
exports.main = function(req,res){
	res.render('admin/index', {
		title: 'MirHer | Admin',
	});
};

exports.news = function(req,res){
	res.render('admin/news', {
		title: 'MirHer | news',
	});
};

exports.portfolio = function(req,res, next){
	cloudinary.api.resource(function(items){
		res.render('admin/portfolio', {
			images: items.resource, title: 'Gallery', cloudinary: cloudinary
		});
	});
};

exports.upload = function(req,res){
		var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary'}),
			cloudStream = cloudinary.uploader.upload_stream(function() {
			res.redirect('/'); });

			imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
	};