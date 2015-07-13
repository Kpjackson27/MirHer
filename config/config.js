'use strict';

//set the 'development' environment configuration object
module.exports = require('./env/' + process.env.NODE_ENV + '.js');