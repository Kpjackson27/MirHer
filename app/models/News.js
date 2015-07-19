'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NewsSchema = new Schema({
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
	content: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	image : {
		type : JSON
	},
});


// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('News', NewsSchema);