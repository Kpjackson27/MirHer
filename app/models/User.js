'use strict';

//Load module dependencies
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto'),
	Schema  = mongoose.Schema;

//User schema
var UserSchema = new Schema({
	email:{
		type: String,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
	},
	tokens: Array,

	profile: {
		firstname: { 
			type: String,
			default: ''
		},
		lastname: {
			type: String,
			default:''
		},
		phonenumber:{
			type: Number,
			default: ''
		},
		facebook:{
			type:String,
			default:''
		},
		twitter: {
			type: String,
			default:''
		},
		instagram: {
			type: String,
			default:''
		},
		pinterest: {
			type: String,
			default:''
		},
		picture: {
			type: String,
			default: ''
		},
		age: {
			type: String,
			default: ''	
		},
		hairtype: {
			type: String,
			default: ''
		},
		hairhealth: {
			type: String,
			default: ''
		},
		hairchallenges: { 
			type: String,
			default: ''
		},
		weavefrequency: {
			type: String,
			default: ''
		},
		rateofpurchase: {
			type: String,
			default: ''
		},
		hairlength: { 
			type: String,
			default: ''
		},
		hairtexture: {
			type: String,
			default: ''
		},
		numberofbundles: {
			type: String,
			default: ''
		},
		customunits:{
			type: String,
			default: ''
		},
		frontals: {
			type: String,
			default: ''
		},
		colors: {
			type: String,
			default: ''
		},
		products: {
			type: String,
			default:''
		}
	},
	shipping: {
		streetaddress:{
			type: String,
			default: ''
		},
		unit:{
			type: String,
			default: ''
		},
		city:{
			type: String,
			default: ''
		},
		state:{
			type: String,
			default:''
		},
		zipcode: {
			type: String,
			default: ''
		},
		country: {
			type: String,
			default:''
		}
	},
	billing: {
		streetaddress:{
			type: String,
			default: ''
		},
		unit:{
			type: String,
			default: ''
		},
		city:{
			type: String,
			default: ''
		},
		state:{
			type: String,
			default:''
		},
		zipcode: {
			type: String,
			default:''
		},
		country: {
			type: String,
			default:''
		}
	},

	resetPasswordToken: String,
	resetPasswordExpires: Date
});

/**
 *Password hash middleware
*/
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash){
			user.password = hash;
			next();
		});
	});
}); 
/**
 * Helper method for validation user's password.
 */
 UserSchema.methods.comparePassword = function(candidatePassword, cb){
 	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
 		if(err) return cb(err);
 		cb(null, isMatch);
 	});
 };
 /**
  * Helper method for getting user's gravatar.
  */
  UserSchema.methods.gravatar = function(size){
  	if(!size) size = 200;
  	if(!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  };

  module.exports = mongoose.model('User', UserSchema);