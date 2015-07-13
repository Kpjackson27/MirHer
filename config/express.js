'use strict';

//load the module dependencies
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	multer = require('multer'),
	flash = require('express-flash'),
	session = require('express-session'),
	lusca = require('lusca'),
	MongoStore = require('connect-mongo')(session),
	connectAssets = require('connect-assets'),
	path = require('path'),
	_ = require('lodash'),
	cookieParser = require('cookie-parser'),
	expressValidator = require('express-validator'),
	errorHandler = require('errorhandler'),
	cloudinary = require('cloudinary').v2,
	passport = require('passport');

//Create a new error handling controller method
var getErrorMessage = function(err){
	if(err.errors) {
		for(var errName in err.errors) {
			if(err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

//Define express configuration
module.exports = function(db) {
	//create new express application instance
	var app = express();

	cloudinary.config({
		cloud_name:	'db433n5ld',
		api_key: '377644565826279',	
		api_secret:	'XAr35npXOawwUgk8M6KKPIWDszY'
	});

	//Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	//Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	//Configure multer module
	app.use(multer({ dest: path.join(__dirname, 'uploads')}));
	
	//Configure express validator module
	app.use(expressValidator());

	//Configure the MongoDB session storage
	var mongoStore = new MongoStore({
		db: db.connection.db
	});


	//Configure the 'session' middleware
	app.use(session({
		saveUnitialized: true,
		resave: true,
		secret: 'developmentSessionSecret',
		store: mongoStore
	}));

	//set application view engine and 'views' folder
	app.set('views', './app/views');
	app.set('view engine', 'jade');
	app.use(compress());
	
	app.use(connectAssets({
		paths: [path.join('public/styles'), path.join('public/js'), path.join('public/fonts')]
	}));

	//render static files
	app.use(express.static(path.join('public'), { maxAge: 31557600000}));

	//configure the flash messages middleware
	app.use(flash());

	//configure the lusca security middleware
	app.use(lusca({
		csrf: true,
		xframe: 'SAMEORIGIN',
		xssProtection: true
	}));

//cloudinary.uploader.upload("my_picture.jpg", function(result) { 
 // console.log(result);
//});
	//Configure passport middleware
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(function(req,res,next){
		res.locals.user = req.user;
		next();
	});
	//Configure error handler module
	app.use(errorHandler());

	//Load the routing files
	require('../app/routes/index.js')(app);
	require('../app/routes/users.js')(app);
	require('../app/routes/articles.js')(app);
	require('../app/routes/links.js')(app);
	require('../app/routes/comingsoon.js')(app);
	require('../app/routes/post.js')(app);
	require('../app/routes/orders.js')(app);

	return app;
};