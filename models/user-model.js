var TweetModel = require('./tweetmodel');

class User {
    constructor(twit){
        if(twit.length == 0)
            throw "Nothing there!"
            
        this.image = "";
        this.tweets = [];
        this.hashtags = [];
        this.mentions = [];
        this.name = '';
        this.bannerimg = '';
        
        try{
            twit = twit.filter(m => m.text.indexOf("RT ") == -1);
            this.image = twit.map(m => m.user.profile_image_url_https)[0].replace("normal", "200x200");
            this.bannerimg = twit.map(m => m.user.profile_banner_url)[0];
            this.name = twit.map(m => m.user.name)[0];
            
            this.tweets = twit.map(m => new TweetModel(m)).slice(15);

            this.hashtags = this.grabPopular(this.tweets.map(m => m.hashtags.map(h => "#" + h)).reduce((p, c) => p.concat(c)));
            this.mentions = this.grabPopular(this.tweets.map(m => m.mentions.map(b => "@" + b)).reduce((p, c) => p.concat(c)));
        }catch(e){
            console.log('well somethings wrong');
        }
    }
    
    grabPopular(tagList){
        var tags = {};
        for(let tag of tagList){
            tags[tag] = tags[tag] ? tags[tag] + 1 : 1;
        }
        var items = Object.keys(tags).map(key => [key, tags[key]]);

        // Sort the array based on the second element
        items.sort((first, second) => second[1] - first[1]);

        // Create a new array with only the first 5 items
        return items.slice(0, 3).map(m => m[0]);
    }
    
    toJson(){
        return {
            image: this.image,
            banner: this.bannerimg,
            name: this.name,
            tweets: this.tweets.map(m => m.toJson()),
            mentions: this.mentions,
            hashtags: this.hashtags
        };
    }
    
    scrub(texts){
        
        texts = texts
            .map(m => m.replace(/@(\w+)/g, "@----blurry----"))
            .map(m => m.replace(/\"https\"(\w+)/g, ""));
        return texts;
    }
}

module.exports = User;