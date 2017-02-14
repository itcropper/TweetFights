
var twitter = require('twitter'),
    terms = require('./statics/terms'),
    request = require('request'),
    SinglePost = require('../models/SinglePost'),
    Promise = require('promise');


class Twitters {
    constructor(){
        
        try {
            var envVars = require("../environment");
            this.key = envVars.Twitter.key;
            this.secret =  envVars.Twitter.secret; 
            this.access_token = envVars.Twitter.access_token;
            this.access_token_secret = envVars.Twitter.access_token_secret;            
        }catch(e){
            this.key = process.env.twitter_twitterKey;
            this.secret =  process.env.twitter_twitterSecret; 
            this.access_token = process.env.twitter_twitterAccessToken;
            this.access_token_secret = process.env.twitter_twitterAccessTokenSecret;
        }
        
        this.twitter = new twitter({
          consumer_key: this.key,
          consumer_secret: this.secret,
          access_token_key: this.access_token,
          access_token_secret: this.access_token_secret
        });
                
        this.score = 0;
        this.highestSoFar = {};
        this.lastHighest = {};
        
        this.collect();
        
        setInterval(() => {
            this.storeHighest();
        }, 1000 * 60 * 10)
        
    }
    
    query(res){
        
      res.send("<img src='"+this.highestSoFar.img+"' />")
        
    }
    search(cb){
        cb()
    }
    
    storeHighest(){
        function scrub(texts){
            
            try{
                texts = texts
                    .map(m => m.replace(/@(\#+)/g, ''))
                    .map(m => m.replace(/@(\@+)/g, ''))
                    .map(m => m.replace(/\"https\"(\w+)/g, ""));
            }catch(e){
                return texts || "";
            }
            return texts;
        }
        
        if(this.highestSoFar.img == this.lastHighest.img){
            return;
        }
        this.score = 0;
        var post = new SinglePost();
        post.img = this.highestSoFar.img;
        post.title = scrub(this.highestSoFar.title);
        post._id = this.highestSoFar.id;
        this.lastHighest = this.highestSoFar;
        post.createdAd = new Date();
        post.save(function(err, data){
            if(err){
                console.log('Error on Twitter', err)
            }else{
                console.log('Success on Twitter');
            }
        })
        
    }
    
    collect(a, res){
        
        let score = 0;
        let highestSoFar = null;
        
        //var t = terms.reduce((p,c) => p + "," + c);
        var options = {
            lang: "eng",
            q: terms.map(m => "#" + m),
            query: terms,
            result_type:"recent"
        }
        
        var _this = this;
        var stream = this.twitter.get('search/tweets.json?result_type=${options.result_type}&lang=${options.lang}&q=${options.q}', options, (err, data) => {
            
            if(err){
                console.log("Twitter: ", err);
                return (err);
            }
            
            console.log(data, data.statuses.length);
            

        });
        
    }
}


module.exports = {
 twits: Twitters
}