'use strict';

//Load the module dependencies
var config = require('./config'),
	mongoose = require('mongoose');

//Define the Mongoose configuration method
module.exports = function() {
	//use Mongoose to connect to MongoDB
	var db = mongoose.connect(config.db);
	//var db = mongoose.connect('mongodb://kareem:F@stskin101@ds045882.mongolab.com:45882/mirher');

	mongoose.connection.on('error', function(){
		console.error('MongoDB Connection Error. Please make sure that MongoDB is running!');
	});

	//Load the application models
	require('../app/models/User');
	require('../app/models/News');
	require('../app/models/Shipping');
	//Return the Mongoose connection instance
	return db;
};