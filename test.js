var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

var port = 3000;

app.get('/', function(req, res){
  var html = '<html><h1>Hello Moolchand</h1></html>';
      html += '<h2>Hey guys</h2>';
  res.send(html);
});

app.get('/profile/:firstname/:lastname', function(req, res){
  res.send('<html>Hello '+ req.params.firstname +' '+ req.params.lastname +'</html>');
});

app.get('/cookie', function(req, res, next){
  console.log(req.cookies);
  next();
})

app.listen(port);
