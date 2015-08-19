'use strict';

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('account/request', {
		title: 'MirHer | Request Chest',
	});
};