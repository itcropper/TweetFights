var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('post', new Schema({
    _id: String,
    title:String,
    img: String,
    snippet: String,
    likes: Number,
    createdAt: {type: Date, default: Date.now},
    tags: [String]
}));