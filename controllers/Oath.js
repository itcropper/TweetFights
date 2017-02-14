var auth = require('oauth');


class OAuth {
    constructor(key, secret, url){
        [this.key, this.secret, this.url] = [key, secret, url];
    }
    
    getAuth(){
        var OAuth2 = auth.OAuth2;  
        var oauth2 = new OAuth2(this.key, this.secret, this.url, null, 'oauth2/token', null);      
        oauth2.getOAuthAccessToken('', {'grant_type':'client_credentials'},function (e, access_token, refresh_token, results){
            console.log('bearer: ',access_token);
            done();
        });        
    }
}


module.exports = OAuth;