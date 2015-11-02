'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OrdersSchema = new Schema({
	orderid:{
		type: Number,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	
});


// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('Orders', OrdersSchema);