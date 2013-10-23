var dao = require("../src/dao");
var expressValidator = require('express-validator');

export function dictionaries(req, res) {
  dao.getDictionaries(function (dicts) {
    res.json(dicts);
  });
};

export var forms = {
  list: function (req, res) {
    dao.forms.list(function (err, items) {
      res.json(items);
    });
  },
  get: function (req, res) {
    var id = ~~req.params.id;
    dao.forms.get(id, function (err, item) {
      res.json(formatRespData(err, item));
    });
  },
  post: function (req, res) {
    forms.validate(req, function (errors) {
      if (errors) {
        console.log("API validation error");
        console.log(errors);
        res.send('There have been validation errors: ' + JSON.stringify(errors), 400);
      } else {
        var form = req.body;
        dao.forms.saveOrUpdate(form, function (err) {
          res.json(formatRespData(err, null));
        });
      }
    });
  },
  del: function (req, res) {
    var id = ~~req.params.id;
    dao.forms.remove(id, function (err) {
      res.json(formatRespData(err, null));
    });
  },
  
  validate: function (req, result) {
    dao.getDictionaries(function (dicts) {
      var body = req.body;
      req.onValidationError(function(msg: String)  {throw new Error;});
      
      //TODO wpisać HTML (XSS, HTML)
      try {
        req.assert('area', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('area', 'Wartość jest niepoprawna').isIn(dicts.sAreasSimple);
      } catch (e) {}
      try {
        req.assert('name', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('name', 'Pole może mieć maksymalnie 130 znaków').len(0, 130);
      } catch (e) {}
      try {
        req.assert('scope', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('scope', 'Pole może mieć maksymalnie 250 znaków').len(0, 250);
      } catch (e) {}
      try {
        req.assert('target', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('target', 'Pole może mieć maksymalnie 70 znaków').len(0, 70);
      } catch (e) {}
      try {
        req.assert('type', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('type', 'Wartość jest niepoprawna').isIn(dicts.sTypes);
      } catch (e) {}
      try {
        req.assert('hours', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('hours', 'Pole musi być liczbą całkowitą').isInt();
        req.assert('hours', 'Maksymalna wartość to 168').max('168');
      } catch (e) {}
      try {
        req.assert('startDate', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('startDate', 'Niepoprawny format daty. Oczekiwano "dd.mm.rrrr". Przykład: 23.09.2013').regex(/^\(0?[1-9]|[12][0-9]|3[01]).(0?[1-9]|1[012]).d{4}$/);
        var dateParts = body.startDate.split('.');
        var date= new Date(dateParts[2], dateParts[1]-1, dateParts[0]);
        if (date.getTime() < new Date().getTime()) {
          req.assert('startDate', 'Zbyt wczesna data').isNull();//Trik
        }
        var maxDate = new Date();
        maxDate.setFullYear(2014);
        if (date.getTime() > maxDate.getTime()) {
          req.assert('startDate', 'Zbyt późna data').isNull();//Trik
        }
        body.startDateConverted = date;
      } catch (e) {}
      try {
        req.assert('owner', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('owner', 'Wartość jest niepoprawna').isIn(dicts.sOwners);
      } catch (e) {}
      try {
        req.assert('teacher', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('teacher', 'Pole może mieć maksymalnie 70 znaków').len(0, 70);
      } catch (e) {}
      try {
        req.assert('payment', 'Wypłenienie pola jest wymagane').notNull();
        req.assert('payment', 'Pole musi być liczbą całkowitą').isInt();
        req.assert('payment', 'Maksymalna wartość to 100000').max('100000');
        //TODO grosze :)
      } catch (e) {}
      try {
        req.assert('addInfo', 'Pole może mieć maksymalnie 250 znaków').len(0, 250);
      } catch (e) {}
      try {
        var indexValue = body.index;
        console.log(indexValue);
        if (indexValue) {
          if (!Array.isArray(indexValue)) {
            indexValue = [indexValue];
          }
          var validator = new expressValidator.Validator();
          for (var i = 0; i < indexValue.length; i++) {
            try {
              validator.check(indexValue[i]).notNull().isIn(dicts.sIndex);
            } catch (e) {
              addError(req, 'index', indexValue[i], 'Wartość jest niepoprawna');
            }
          }
          if (indexValue.length > 4) {
            addError(req, 'index', indexValue.length, 'Możesz wybrać maksymalnie 4 opcje');
          }
        }
      } catch (e) {}
      
      var errors = req.validationErrors(true);
      
      result(errors);
    })
  },
}



function formatRespData (err, content) {
  if (err) {
    console.log(err);
  }
  return {
    code: err ? 0 : 1,
    err: err,
    content: content
  }
}

function addError(req, param, value, msg) {
  var error = {
    param : param,
    msg   : msg,
    value : value
  };

  if (req._validationErrors === undefined) {
    req._validationErrors = [];
  }
  req._validationErrors.push(error);

  if (req.onErrorCallback) {
    req.onErrorCallback(msg);
  }
  return this;
}