// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
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

exports.products = function(req,res){
    res.render('admin/products', {
        title: 'MirHer | Products',
    });
};

exports.addProducts = function(req,res){
    res.render('admin/addproducts', {
        title: 'MirHer | Add Products',
    });
};

//create a new article
exports.create = function(req, res) {
    console.log(req.files.file.path);
    console.log(req.body);
    cloudinary.uploader.upload(
        req.files.file.path,
        function(result){
            //cloudinary
            var newUrl = cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                crop: 'thumb',
                gravity: 'face',
                radius: '25'
            });
    // var product = new Product(req.body);
    var product = new Product();
    product.type = req.body.type;
    product.texture = req.body.texture;
    product.color = req.body.color;
    product.quantity = req.body.quantity;
    product.image = newUrl;
    // Try saving the article
    product.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            console.log(getErrorMessage(err));
            console.log('Error: Product did not save in mongo db'); 
            console.log(err);
            console.log(product);
            return res.redirect('/admin/addproducts');
        } else {
            req.flash('success', { msg: 'Product Uploaded. Check out the "Products" tab'});
            console.log('success');
            return res.redirect('/admin/products');
        }
    });
   }
  );
};

// return a list of articles
exports.list = function(req, res) {
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
                    res.render('admin/products', {
                        title: 'Products',
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

/*
// returns a single article
exports.read = function(req, res) {
    res.format({
        html: function() {
            res.render('admin/singleprod', {
                title: 'Single Product',
                "product": req.product
            });
        },
        json: function() {
            res.json(req.product);
        }
    });
};
*/

// get update page
// exports.getUpdate = function(req, res){
// 	res.format({
// 		html: function() {
// 			res.render('article/edit', {
// 				title: 'Single Poem',
// 				"article": req.article
// 			});
// 		},
// 		json: function() {
// 			res.json(req.article);
// 		}
// 	});

// };

// Create a new controller method that updates an existing article
// exports.update = function(req, res) {
// 	// Get the article from the 'request' object
// 	var article = req.article;

// 	// Update the article fields
// 	article.title = req.body.title;
// 	article.content = req.body.content;

// 	// Try saving the updated article
// 	article.save(function(err) {
// 		if (err) {
// 			// If an error occurs send the error message
// 			return res.status(400).send({
// 				message: getErrorMessage(err)
// 			});
// 		} else {
// 			// Send a JSON representation of the article 
// 			res.json(article);
// 		}
// 	});
// };

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
    // Get the article from the 'request' object
    var product = req.product;
    // Use the model 'remove' method to delete the article
    product.remove(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Failed to delete verse.'
            });
            res.redirect('/admin/products');
        } else {
            req.flash('success', {
                msg: 'product deleted.'
            });
            res.redirect('/admin/products');
            // Send a JSON representation of the article 
            // res.json(article);
        }
    });
};

// Create a new controller middleware that retrieves a single existing article
exports.productByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single article 
    Product.findById(id).exec(function(err, product) {
        if (err) return next(err);
        if (!product) {
            req.flash('errors', {
                msg: 'Failed to load product ' + id
            });
            return res.redirect('/admin/products');
        }
        // If an article is found use the 'request' object to pass it to the next middleware
        req.product = product;
        // console.log('id: ' + req.article.creator.id);
        // console.log('profile: ' + req.article.creator.profile);
        // console.log('profile.name: ' + req.article.creator.profile.name);
        // Call the next middleware
        next();
    });
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
    // If the current user is not the creator of the article send the appropriate error message
    if (req.article.creator.id !== req.user.id) {
        // return res.status(403).send({
        // 	message: 'User is not authorized creator'
        // });

        req.flash('errors', {
            msg: 'User is not authorized creator'
        });
        // return(next(err));
        return res.redirect('/main');
    }

    // Call the next middleware
    next();
};