class TweetModel {
    constructor(data){
        try{
            this.text = this.scrub(data.text);
            //console.log(data)
            this.hashtags = data.entities.hashtags.map(h => h.text);
            this.mentions = data.entities.user_mentions.map(h => h.screen_name);
            this.userimg = data.user.profile_image_url;
            this.popularity = data.retweet_count * 2 + data.favorite_count;
            
            //console.log(this.hashtags);
            
        }catch(e){
            console.log("error here")
        }
    }
    
    toJson(){
        var returnObject = {
            text: this.text,
            popularity: this.popularity
        };
        if(this.hashtags.length)
            returnObject.hashtags = this.hashtags;
        if(this.mentions.length)
            returnObject.mentions = this.mentions;
        
        return returnObject;
    }
    
    scrub(text){
        return text.replace(/@(\w+)/g, "@----blurry----");
    }
}

module.exports = TweetModel;