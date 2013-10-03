///<reference path='./express.d.ts' />
///<reference path='./node.d.ts' />

import express = require('express');
import http = require('http');
import path = require('path');

export function startServer() { 

  /**
   * Module dependencies.
   */
   
  var db = require("./src/db.ts");
  
  var exphbs  = require('express3-handlebars');
  
  var app = express();
  
  // all environments
  app.set('port', process.env.PORT || 3000);
  //app.set('port', "3000");
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
  
  app.get('/', require('./routes/index.ts'));
  app.post('/', require('./routes/index_post.ts'));
  
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