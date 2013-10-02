///<reference path='./node_modules/typescript.api/decl/node.d.ts' />


export function startServer() {

  /**
   * Module dependencies.
   */
  
  var express = require('express');
  var routes = require('./routes');
  var user = require('./routes/user');
  var http = require('http');
  var path = require('path');
  var db = require("./src/db");
  
  var exphbs  = require('express3-handlebars');
  
  var app = express();
  
  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  
  app.engine('handlebars', exphbs({defaultLayout: 'template'}));
  app.set('view engine', 'handlebars');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  } 
  
  //zmiana do zakomitowania
  
  //app.get('/', routes.index);
  //app.get('/users', user.list);
  //app.get('/', function (req, res) {
  //  res.render('home');
  //});
  app.get('/', require('./routes/index'));
  app.post('/', require('./routes/index_post'));
  
  // Initialize the database before starting the server.
  db.init(function(err) {
    if (err) {
      console.log(err);
    } else {
      http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
      });
    }
  });

}