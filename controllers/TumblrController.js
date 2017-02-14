var tumblr = require('tumblr.js');
var Post = require('../models/SinglePost');
var terms = require('./statics/terms')[0];

class Tumblr {
    constructor(){
        try{
            var envVars = require("../environment");
            this.client = tumblr.createClient({consumer_key: envVars.Tumblr.api_key});
        }
        catch(e){
            this.client = tumblr.createClient({ consumer_key: process.env.tumblr_consumerKey});
        }
        this.query(terms);
        setInterval(() => this.query(terms), 1000 * 60 * 10);
    }
   

    scrubText(text) {
        return text
            .split("")
            .map(m => m.indexOf(".com") > -1 ? "" : m)
            .join("")
            .replace("@\\w+ *","")
            .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
            .replace(/Source:/g, '');
                
    }
    
    query(term){
        this.client.taggedPosts(term, (err, data) => {
            if(err == null && data && data.length){
                
                var g = data.map(m => {
                    return {
                        id: m.id,
                        summary: m.summary,
                        note_count: m.note_count,
                        img_link: m.photos ? m.photos[m.photos.length - 1].original_size.url : ""
                    };
                }).filter(m => m.img_link != "" && m.summary)
                .sort((a,b) => b.note_count - a.note_count)[0];

                Post.findById(g.id, (err, data) => {
                    if(err || data == null){
                        Post.find({img : g.img_link}, (err, d) => {
                            if(err || data == null){
                              var post = new Post();

                                post.img = g.img_link;
                                post.title = this.scrubText(g.summary);
                                post._id = g.id;
                                post.createdAt = new Date();

                                post.save((err, data) => {
                                    if(!err){
                                        return console.log("Success on tumblr" + data);
                                    }
                                    return console.log('Error on Tumblr', error);
                                });
                            }
                        });
  
                    }else{
                        return console.log('already exists');
                    }
                });
            }else {
                //console.log(this.client);
                console.log(err != null ? "Tumblr: Error: " + err : "Tumblr: No data from last call");
            }            

        });
    }
}

module.exports = Tumblr;
