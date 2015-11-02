'use strict';

var cloudinary = require('cloudinary'),
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

exports.users = function(req,res){
	res.render('admin/users', {
		title: 'MirHer | Users',
	});
};




exports.addImage = function(req,res){
	var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary' }),
		cloudStream = cloudinary.uploader.upload_stream(function() { res.redirect('/portfolio'); });

	imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
};