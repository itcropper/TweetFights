
var access_token = require("../environment").igaccess_token,
    SinglePost = require("../models/SinglePost"),
    terms = require('./statics/terms')[0],
    request = require('request');

var bod = null;

class IGController {
    constructor(tag = "wereComingThor"){
        
        this.url = `https://api.instagram.com/v1/tags/${terms}/media/recent?access_token=${access_token}`
        this.search();
        setInterval(this.search, 1000 * 60 * 10);
    }
    
    query(page, res){
        res.json(bod);
//        SinglePost.find({}, (err, data) => {
//            if(err)
//                return callback(err);
//            return callback(data);
//        })
    }
    
    search(){
        try{
            request(this.url, (err, response, body) => {
                try {
                    if(err)
                        console.log(err);
                    else {
                        console.log("IG got something!",this.url, body)
                        body = JSON.parse(body);



                        var data = body.data.reduce((p,c) => c.likes.count > p.likes.count ? c : p);

                        bod = data.id;

                        var image = data.images.standard_resolution.url;

                        var post = new SinglePost();
                        post._id = 
                        post.img = image;
                        post.title = data.caption.text.slice(0, Math.min(data.caption.text.length, 20)) + "...";
                        post.snippet = data.caption.text
                        post.createdAt = new Date();

                        post.save(function(err, data){
                            if(err){
                                console.log("Instagram: error, ", err.message);
                            }
                            else {
                                console.log("Instagram: Saved to DB, ");
                            }
                        })

                    }
                }catch(e){
                    console.log("Instagram: error, ", e.message);
                }
            });
        }catch(e){
            console.log("Instagram: error, ", e.message);
        }
        
    }
}

module.exports = IGController;