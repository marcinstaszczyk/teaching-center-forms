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
  var http = require('http'),
      path = require('path'),
      exphbs  = require('express3-handlebars'),
      expressValidator = require('express-validator'),
      reload = require('reload'),
      api = require("./routes/api"),
      colors = require('colors');
  
  
  var app = express();
  
  // all environments
  app.set('port', process.env.PORT || 3000);
  //app.set('port', "3000");
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  
  var exphbs = exphbs({defaultLayout: 'template', helpers: {options_selected : options_selected, radio_checked: radio_checked}});
  app.engine('handlebars', exphbs);
  
  var clientDir = path.join(__dirname, 'client');
  
  app.set('view engine', 'handlebars');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(clientDir));
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  } 
  
  app.get ('/form', require('./routes/index.ts').go);
  app.post('/form', require('./routes/index_post.ts').go);
  app.get ('/forms_list', require('./routes/forms.ts').go);
  
  app.get ('/api/forms', api.forms.list);
  app.get ('/api/forms/:id', api.forms.get);
  app.post('/api/forms', api.forms.post);
  app.post('/api/forms/:id', api.forms.post);
  app.del ('/api/forms/:id', api.forms.del)
  
  app.get ('/api/dictionaries', api.dictionaries);
  
  app.get('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'index.html'))
  })
    
  // Initialize the database before starting the server.
  db.init(function(err) {//TODO move do DAO
    if (err) {
      console.log(err);
    } else {
      var server = http.createServer(app);
      
      reload(server, app);
      
      server.listen(app.get('port'), function() {
        console.log("Web server listening in %s on port %d", colors.red(process.env.NODE_ENV), app.get('port'));
      });
    }
  });

}

function options_selected(options, selected) {
  var ret = '';
  for (var i = 0; i < options.length; i++) {
    var option = '<option value="' + options[i] + '"';
    if (isSelected(options[i], selected)) {
      option += ' selected="selected"';
    }
    option += '>' + options[i] + '</option>';
    //TODO FIXME obecnie jest bazpieczne bo wyświetlamy dane z bazy, ale ogólnie w tym miejscu powinniśmy wykonać escape-owanie: Handlebars.Utils.escapeExpression(options[i])
    ret += option;
  }
  //return new Handlebars.SafeString(ret);
  return ret;
}

function radio_checked(name, options, checked) {
//address = Array.isArray(address) ? address[0] : address;
  var ret = '';
  for (var i = 0; i < options.length; i++) {
    var option = '<label class="checkbox"><input type="checkbox" value="' + options[i] + '" name="' + name + '"';
    if (isSelected(options[i], checked)) {
      option += ' checked="checked"';
    }
    option += '/>' + options[i] + '</label>';
    //TODO FIXME obecnie jest bazpieczne bo wyświetlamy dane z bazy, ale ogólnie w tym miejscu powinniśmy wykonać escape-owanie: Handlebars.Utils.escapeExpression(options[i])
    ret += option;
  }
  //return new Handlebars.SafeString(ret);
  return ret;
}

function isSelected(option, selected) {
  if (selected) {
    if (Array.isArray(selected)) {
      for (var j = 0; j < selected.length; j++) {
        if (selected[j] && selected[j].toLowerCase() == option.toLowerCase()) {
          return true;
        }
      }
    } else {
      return selected.toLowerCase() == option.toLowerCase();
    }
  }
  return false;
}
