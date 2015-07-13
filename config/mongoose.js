'use strict';

//Load the module dependencies
var config = require('./config'),
	mongoose = require('mongoose');

//Define the Mongoose configuration method
module.exports = function() {
	//use Mongoose to connect to MongoDB
	var db = mongoose.connect(config.db);

	mongoose.connection.on('error', function(){
		console.error('MongoDB Connection Error. Please make sure that MongoDB is running!');
	});

	//Load the application models
	require('../app/models/User');
	require('../app/models/Article');
	//Return the Mongoose connection instance
	return db;
};