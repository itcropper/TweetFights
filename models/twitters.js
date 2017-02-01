
var twitter = require('twitter'),
    User = require('./user-model'),
    UserTweets = require('./twitteruser'),
    Promise = require('promise'),
    Tweet = require('./tweetmodel');

class Twitters {
    constructor(){
        this.key = process.env.twitter_key;
        this.secret =  process.env.twitter_secret; 
        this.access_token = process.env.twitter_access_token;
        this.access_token_secret = process.env.twitter_access_token_secret;
        this.twitter = new twitter({
          consumer_key: this.key,
          consumer_secret: this.secret,
          access_token_key: this.access_token,
          access_token_secret: this.access_token_secret
        });
    }
    
    query(username, callback){
        var options = {
            screen_name: username,
            count:40
        }
        let _this = this;
        _this.twitter.get(`statuses/user_timeline`, options, function(err, data){
            if(err != null){
                console.log("error:", err);
                callback.status(500).send(err);
                return;
            }else{
                callback.json(data);
            }
        });
    }
    
    search(a, res){
        var options = {
            screen_name: a,
            count:40
        }
        let _this = this;
        _this.twitter.get(`statuses/user_timeline`, options, function(err, data){
            if(err != null){
                console.log("error:", err);
                res.status(500).send(err);
                return;
            }else{
                try {
                    console.log('searching...', a)
                    //get mentions and hashtags and use that to get other tweet
                    var user = new User(data);
                    let tweets = [];
                    let entities = user.hashtags.concat(user.mentions);
                    var promises = [];
                    for(let entity of entities){

                        promises.push(new Promise((fulfill, reject) => {
                            var tweetoptions = {
                                result_type: "popular",
                                q: entity,
                                lang: "en"
                            };

                            _this.twitter.get('search/tweets.json', tweetoptions, function(err2, data2){
                                if(err2 != null){
                                    console.log(err2);
                                    reject(err2);
                                }
                                else{
                                    fulfill(data2.statuses.map(f => new Tweet(f)));
                                }
                            });
                        }));
                    }
                    Promise.all(promises).then(values => {
                        console.log('finished promises')
                        var vals = values.filter(m => m).reduce((p, c) => p.concat(c));
                        res.json({original: user.toJson(), fakes: vals.filter(m => m.toJson).map(m => m.toJson())});
                    });
                }
                catch(e){
                    res.status(404).send("Nothing there");
                }
            }
        });
    }
}


module.exports = {
 twits: Twitters
}