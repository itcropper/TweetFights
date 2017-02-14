var t =     require('../controllers/TwitterController').twits;
var ig =    require('../controllers/InstagramController');
var tum =   require('../controllers/TumblrController');
var data =  require('../controllers/DataController');
var Oauth =  require('../controllers/Oath');
var path = require('path');

t = new t();
ig = new ig();
tum = new tum();
data = new data();

//Oauth = new Oauth()

module.exports = function(app) {
    
    app.get('/api/:id', function(req, res){
       data.getLast(req.params.id, res);
    });
    
    app.get('/api/full/', function(req, res){
        ig.query("", res);
    });

    app.get('/api/', function(req, res) {
        data.getLatestList(0, res);
    });

    app.get('*', function(req, res) {
        res.sendFile(path.resolve('public/index.html'));
    });
};