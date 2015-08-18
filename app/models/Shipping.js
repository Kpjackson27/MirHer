'use strict'; 

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ShippingSchema = new Schema({
	street: {
		type: String,
		default: ''
	},
	apartment: {
		type: String,
		default: ''
	},
	city: {
		type: String,
		default: '',
	},
	state:{
		type:String,
		default:''
	},
	zip:{
		type: String,
		default:''
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
});


// Create the 'Article' model out of the 'ShippingSchema'
module.exports =  mongoose.model('Shipping', ShippingSchema);	