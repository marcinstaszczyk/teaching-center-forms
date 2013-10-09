///<reference path='./node.d.ts' />
///<reference path='./express.d.ts' />
///<reference path='./express-validator.d.ts' />
///<reference path='./src/db.ts' />

import express = require('express');
import db = require("./src/db");

export function startServer() { 

  /**
   * Module dependencies.
   */
  var http = require('http');
  var path = require('path');
  var exphbs  = require('express3-handlebars');
  var expressValidator = require('express-validator');
  
  
  var app = express();
  
  // all environments
  app.set('port', process.env.PORT || 3000);
  //app.set('port', "3000");
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  
  var aaaa = exphbs({defaultLayout: 'template', helpers: {options_selected : options_selected}});
  app.engine('handlebars', aaaa);
  
    /*Handlebars.registerHelper('options_selected', );*/
  
  
  app.set('view engine', 'handlebars');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  } 
  
  app.get('/', require('./routes/index.ts').go);
  app.post('/', require('./routes/index_post.ts').go);
  app.get('/forms', require('./routes/forms.ts').go);
  
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

function options_selected(context, test) {
  var ret = '';
  for (var i = 0; i < context.length; i++) {
    var option = '<option value="' + context[i] + '"';
    if (test && test.toLowerCase() == context[i].toLowerCase()) {
      option += ' selected="selected"';
    }
    option += '>' + context[i] + '</option>';
    ret += option;
  }

  return ret;
}
/*function options_selected(context, test) {
  var ret = '';
  for (var i = 0; i < context.length; i++) {
    var option = '<option value="' + context[i] + '"';
    if (test.toLowerCase() == context[i].toLowerCase()) {
      option += ' selected="selected"';
    }
    option += '>' + Handlebars.Utils.escapeExpression(context[i]) + '</option>';
    ret += option;
  }

  return new Handlebars.SafeString(ret);
}*/