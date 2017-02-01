var t = require('../models/twitters').twits;
t = new t();


module.exports = function(app) {
    
    app.get('/api/full/:user_name', function(req, res){
        t.query(req.params.user_name, res);
    })

    app.get('/api/:user_name', function(req, res) {
        t.search(req.params.user_name, res);
    });

    app.get('/', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
};