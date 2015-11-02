// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose');
  //  Product = mongoose.model('Products');




exports.orders = function(req,res){
    res.render('admin/orders', {
        title: 'MirHer | Orders',
    });
};