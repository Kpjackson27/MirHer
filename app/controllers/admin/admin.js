'use strict';

var cloudinary = require('cloudinary'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    fs = require('fs');


//Create a new 'render' controller method
exports.main = function(req, res) {
    res.render('admin/index', {
        title: 'MirHer | Admin',
    });
};

exports.news = function(req, res) {
    res.render('admin/news', {
        title: 'MirHer | news',
    });
};

exports.users = function(req, res) {
    res.render('admin/users', {
        title: 'MirHer | Users',
    });
};

exports.editUser = function(req, res) {
    res.format({
        html: function() {
            res.render('admin/userEdit', {
                title: 'MirHer |Admin | Edit User',
                "u": req.u
            });
        }
        // ,
// json: function() {
//     res.json(u);
// }
    });
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) {
            req.flash('errors', {
                msg: 'Failed to find user ' + id
            });
            return res.redirect('/');
        }
        // If an article is found use the 'request' object to pass it to the next middleware
        req.u = user;
        // Call the next middleware
        next();
    });
};


exports.addImage = function(req, res) {
    var imageStream = fs.createReadStream(req.files.image.path, {
            encoding: 'binary'
        }),
        cloudStream = cloudinary.uploader.upload_stream(function() {
            res.redirect('/portfolio');
        });

    imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
};