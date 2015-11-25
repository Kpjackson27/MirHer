'use strict';

//Load module dependencies
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

//User schema
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    referralcode: {
        type: String,
        unique: true,
    },
    tokens: Array,

    profile: {
        firstname: {
            type: String,
            default: ''
        },
        lastname: {
            type: String,
            default: ''
        },
        credit: {
            type: Number,
            default: 10
        },
        phonenumber: {
            type: Number,
            default: ''
        },
        facebook: {
            type: String,
            default: ''
        },
        twitter: {
            type: String,
            default: ''
        },
        instagram: {
            type: String,
            default: ''
        },
        pinterest: {
            type: String,
            default: ''
        },
        picture: {
            type: String,
            default: ''
        },
        age: {
            type: String,
            default: ''
        },
        orderamount: {
            type: Number,
            default: 0
        },
        referrals: {
            type: Number,
            default: 0
        },
        rewardPerReferralPurchase: {
            type: Number,
            default: 10
        }
    },
    shippings: [{
        street: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        zip: {
            type: String,
            default: ''
        }
    }],

    billings: [{
        street: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        zipcode: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

/**
 *Password hash middleware
 */
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.addShippingAddr = function(street) {
    if (this.shippings.street != street) {
        // this.shippings.push(id);
        console.log("street !=");
    } else {
        // this.following.splice(this.following.indexOf(id), 1);
        console.log("street ==");
    }
    console.log(this.shippings);
};
/**
 * Helper method for validation user's password.
 */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
/**
 * Helper method for getting user's gravatar.
 */
UserSchema.methods.gravatar = function(size) {
    if (!size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', UserSchema);