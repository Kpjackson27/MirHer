// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    cloudinary = require('cloudinary'),
    Coupon = mongoose.model('Coupons'),
    cc = require('coupon-code');
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
//Show a list of coupons
exports.coupons = function(req, res) {
    res.render('admin/coupons', {
        title: 'MirHer | Coupons',
    });
};

exports.addcoupons = function(req, res) {
    res.render('admin/addcoupons', {
        title: 'MirHer | Add Coupons',
    });
};

//create a new coupon
exports.create = function(req, res) {
    var coupon = new Coupon();

    coupon.type = req.body.type;
    coupon.category = req.body.category;
    coupon.code = cc.generate({
        parts: 2,
        partLen: 5
    });

    // coupon.expiration = req.body.expiration;
    // coupon.status = req.body.status;
    coupon.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/admin/addcoupons');
        } else {
            req.flash('success', {
                msg: 'coupon Uploaded. Check out the "coupons" tab'
            });
            console.log('success');
            return res.redirect('/admin/coupons');
        }
    });
};

// return a list of admin uploaded coupons
exports.list = function(req, res) {
    Coupon.find().sort('-created').exec(function(err, coupons) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/');
        } else {
            console.log(coupons);
            res.format({
                html: function() {
                    res.render('admin/coupons', {
                        title: 'Coupons',
                        "coupons": coupons
                    });
                },
                json: function() {
                    res.json(coupons);
                }
            });
        }
    });
};

/*
// returns a single article
exports.read = function(req, res) {
    res.format({
        html: function() {
            res.render('admin/singleprod', {
                title: 'Single coupon',
                "coupon": req.coupon
            });
        },
        json: function() {
            res.json(req.coupon);
        }
    });
};
*/

// get update page
// exports.getUpdate = function(req, res){
//  res.format({
//      html: function() {
//          res.render('article/edit', {
//              title: 'Single Poem',
//              "article": req.article
//          });
//      },
//      json: function() {
//          res.json(req.article);
//      }
//  });

// };

// Create a new controller method that updates an existing article
// exports.update = function(req, res) {
//  // Get the article from the 'request' object
//  var article = req.article;

//  // Update the article fields
//  article.title = req.body.title;
//  article.content = req.body.content;

//  // Try saving the updated article
//  article.save(function(err) {
//      if (err) {
//          // If an error occurs send the error message
//          return res.status(400).send({
//              message: getErrorMessage(err)
//          });
//      } else {
//          // Send a JSON representation of the article 
//          res.json(article);
//      }
//  });
// };

// Create a new controller method that delete an existing article
// exports.delete = function(req, res) {
//     // Get the article from the 'request' object
//     var coupon = req.coupon;
//     coupon.remove(function(err) {
//         if (err) {
//             req.flash('errors', {
//                 msg: 'Failed to delete verse.'
//             });
//             res.redirect('/admin/coupons');
//         } else {
//             req.flash('success', {
//                 msg: 'coupon deleted.'
//             });
//             res.redirect('/admin/coupons');
//         }
//     });
// };

// Create a new controller middleware that retrieves a single existing article
exports.couponByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single article 
    Coupon.findById(id).exec(function(err, coupon) {
        if (err) return next(err);
        if (!coupon) {
            req.flash('errors', {
                msg: 'Failed to load coupon ' + id
            });
            return res.redirect('/admin/coupons');
        }
        req.coupon = coupon;
        next();
    });
};