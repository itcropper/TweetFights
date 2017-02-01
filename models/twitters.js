
var twitter = require('twitter'),
    User = require('./user-model'),
    UserTweets = require('./twitteruser'),
    Promise = require('promise'),
    Tweet = require('./tweetmodel');

class Twitters {
    constructor(){
        this.key = "1ym22SQ4QHaumr0owPnncrDpZ";
        this.secret = "Jtt3MJC3AeKqo6YqbYiLIuMXHOAbFxE6CEfCKJ4dkWGEotNmyN";
        this.access_token = "91292767-gb6twcha8mrwLyYUb48lRW1b2i5leWiVjsxg7dHTq";
        this.access_token_secret = "EqdgnMVDbYM7HkMNtGAxo2Rotfh8ixNTsg9y6fHcYXade";
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