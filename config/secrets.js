/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {

  //db: process.env.MONGODB || 'mongodb://localhost:27017/test',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'Qin',
    password: process.env.SENDGRID_PASSWORD || 'lyricalintent2015'
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  },


  stripe: {
    secretKey: process.env.STRIPE_SKEY || 'sk_test_BQokikJOvBiI2HlWgH4olfQ2',
    publishableKey: process.env.STRIPE_PKEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
  },

  lob: {
    apiKey: process.env.LOB_KEY || 'test_814e892b199d65ef6dbb3e4ad24689559ca'
  },
   facebook: {
    clientID: process.env.FACEBOOK_ID || '1690419291188156',
    clientSecret: process.env.FACEBOOK_SECRET || '2abaa81d99bb48b3150f28362eb1d8b5',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID || '4caf64356a524082b77c48fe863449c7',
    clientSecret: process.env.INSTAGRAM_SECRET || '1920b0a5150344c687a6858fd98c0295',
    callbackURL: '/auth/instagram/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || '4fyP8wGZwwWJDvNxUnVPYVz6w',
    consumerSecret: process.env.TWITTER_SECRET  || 'mzXGrr2t0EnRS4AFNlWo5HqoKl25xrCYNV2cQA0Vp6Kh7LxKmh',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

     cloudinary: {
        cloud_name: 'dqevqceyc',
        api_key: '443513514397748',
        api_secret: 'lprAeS7gCHRibLkpY5ZGpMcAbBo'
  } 

};