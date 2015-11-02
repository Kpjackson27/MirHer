'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductsSchema = new Schema({
	productid:{
		type: Number,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	image: {
		type: String,
		default: ''
	},
	lengths: {
		type: Number,
		emum: ['8','10','12','14','16','18','20','22','24','26','28', '30']
	},
	color: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	texture: {
		type: String,
		default: ''
	},
	cloudinaryUrl: {
        type: String,
        default: 'http://res.cloudinary.com/dqevqceyc/image/upload/w_100,h_100,c_thumb,g_face,r_25/noProfile_p8w4ge.jpg'
    },
	quantity: {
		type: String,
		default: ''
	},
});


// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('Products', ProductsSchema);