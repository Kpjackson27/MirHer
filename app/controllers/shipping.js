'use strict';
var mongoose = require('mongoose'),
 Shipping = require('../models/Shipping');

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

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('account/shipping', {
		title: 'MirHer | Shipping',
	});
};

//create a new address
exports.addAddress = function(req, res) {
  // Create a new address object
  var shipping = new Shipping(req.body);

  //set creator property for shipping address 
  shipping.creator = req.user;

  // Try saving the address
  shipping.save(function(err) {
    if (err) {
      req.flash('errors', {
        msg: getErrorMessage(err)
      });
      return res.redirect('/account/me/shipping');
    } else {
      req.flash('success', { msg: 'Shipping Address added'});
      return res.redirect('/account/me/shipping');
    }
  });
};


exports.getAddress = function(req, res) {
  // Use the model 'find' method to get a list of articles
  Shipping.find().sort('-creator').populate('creator').exec(function(err, shipping) {
    if (err) {
      req.flash('errors', {
        msg: getErrorMessage(err)
      });
      return res.redirect('/');
    } else {
      res.format({
        html: function() {
          res.render('account/shipping', {
            title: 'Shipping Address',
            "shipping": shipping
          });
        },
        json: function() {
          res.json(shipping);
        }
      });
    }
  });
};
