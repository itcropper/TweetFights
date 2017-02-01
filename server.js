var express =           require('express'),
    app =               express(),
    http =              require('http').createServer(app),
    bodyParser     =    require('body-parser'),
    methodOverride =    require('method-override'),
    path =              require('path'),
    lessMiddleware =    require('less-middleware');


var lessCompiler = require( 'express-less-middleware' )();
app.use( lessCompiler );


app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts',  express.static(__dirname + '/public/scripts'));
app.use('/images',   express.static(__dirname + '/public/images'));
app.use('/fonts',    express.static(__dirname + '/public/fonts'));

var PORT = process.env.PORT || 8000;


require('./app/routes')(app)

http.listen(PORT, function(){
    console.log("Listening on 127.0.0.1/8000");
});