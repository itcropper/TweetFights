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
        text = text || '';
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
                var otherTerms = [
                    "pup", "kit", "dog", "bird", "meow", "ruff", "animal", "fluf", "fur"
                ];
                var blacklisted = ["nsfw", "boob", "butt", "dick", "bikini", "toples", 'graphic']
                var g = data.map(m => {
                    //console.log(m.featured_in_tag, m.tags);
                    return {
                        id: m.id,
                        summary: m.summary,
                        note_count: m.note_count,
                        img_link: m.photos ? m.photos[m.photos.length - 1].original_size.url : "",
                        tags: (m.featured_in_tag || []).concat(m.tags || []).map(n => n.toLowerCase())
                    };
                }).filter(m => 
                          m.img_link != "" && 
                          m.summary &&
                          (m.tags.filter(n => otherTerms.filter(o => n.toLowerCase().indexOf(o) > -1))).length &&
                          (m.tags.filter(n => blacklisted.filter(o => n.toLowerCase().indexOf(o) > -1))).length === 0  
                ).sort((a,b) => b.note_count - a.note_count);
                
                if(g.length == 0){
                    return console.log('Tumblr: No matching posts');
                }
                g = g[0];

                Post.findById(g.id, (err, data) => {
                    if(err || data == null){
                        Post.find({img : g.img_link}, (err, d) => {
                            if(err || data == null){
                                var post = new Post();

                                post.img = g.img_link;
                                post.title = this.scrubText(g.summary);
                                post._id = g.id;
                                post.createdAt = new Date();
                                post.tags = g.tags;
                                
                                post.save((err, data) => {
                                    if(!err){
                                        return console.log("Success on tumblr" + data);
                                    }
                                    return console.log('Error on Tumblr', err);
                                });
                            }
                        });
  
                    }else{
                        return console.log('already exists');
                    }
                });
            }else {
                console.log(err != null ? "Tumblr: Error: " + err : "Tumblr: No data from last call");
            }            

        });
    }
}

module.exports = Tumblr;
