'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CouponsSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	image: {
		type: String,
		default: ''
	},
	//percentage of discount
	type: {
		type: String,
		default:''
	},
	category: {
		type: String,
		emum: ['allhairs','6Ahair','8Ahair','other']
	},
	expiration: {
		type: Date,
	},
	status: {
		type: String,
		emum: ['active','inactive']
	},
	code: {
		type: String,
		default:''
	}
});


// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('Coupons', CouponsSchema);