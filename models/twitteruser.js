var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('usertweets', new Schema({
    profileImageSrc: String, 
    hashtags: [String], 
    mentions:[String],
    tweetTexts:[String],
    expireAfterSeconds: [Number]
}));