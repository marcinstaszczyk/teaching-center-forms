///<reference path='../src/db.ts' />
///<reference path='../express-validator.d.ts' />
///<reference path='./index.ts' />

import db = require("../src/db");
import expressValidator = require('express-validator');
var index = require("./index");
var util = require('util');


export function go(req: ExpressValidator.RequestValidation, res) {

  var body = (<any>req).body;
  req.onValidationError(function(msg: String)  {throw new Error;});
  
  //TODO wpisać HTML (XSS, HTML)
  try {
    req.assert('area', 'Wypłenienie pola jest wymagane').notNull();
    req.assert('area', 'Wartość jest niepoprawna').isIn(index.sAreasSimple);
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
    req.assert('type', 'Wartość jest niepoprawna').isIn(index.sTypes);
  } catch (e) {}
  try {
    req.assert('hours', 'Wypłenienie pola jest wymagane').notNull();
    req.assert('hours', 'Pole musi być liczbą całkowitą').isInt();
    req.assert('hours', 'Maksymalna wartość to 168').max('168');
  } catch (e) {}
  try {
    req.assert('startDate', 'Wypłenienie pola jest wymagane').notNull();
    req.assert('startDate', 'Niepoprawny format daty').regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/);
    var dateParts = body.startDate.split('-');
    var date= new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
    if (date.getTime() < new Date().getTime()) {
      req.assert('startDate', 'Zbyt wczesna data').isNull();//Trik
    }
    var maxDate = new Date();
    maxDate.setFullYear(2014);
    if (date.getTime() > maxDate.getTime()) {
      req.assert('startDate', 'Zbyt późna data').isNull();//Trik
    }
    res.locals.startDateConverted = date;
  } catch (e) {}
  try {
    req.assert('owner', 'Wypłenienie pola jest wymagane').notNull();
    req.assert('owner', 'Wartość jest niepoprawna').isIn(index.sOwners);
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
  
  var errors = req.validationErrors(true);
  if (errors) {
    //res.send('There have been validation errors: ' + util.inspect(errors), 400);
    res.locals.validationErrors = errors; 
    res.locals.form = body
    //res.locals.formString = util.inspect(res.locals.form);
    index.go(req, res);
  } else {
    /*var form = {
      area,
      name,
      scope,
      target,
      type,
      hours,
      startDate,
      owner,
      teacher,
      payment
    }*/
    var form = JSON.parse(JSON.stringify(body));
    form.startDate = res.locals.startDateConverted;
    db.CENForm.create([form], function(err, items) {
      // err - description of the error or null
      // items - array of inserted items
      res.locals.error = err;
      if (!err) {
        res.locals.message = 'Forma została dodana';
        res.locals.savedForms = items;
        for(var i = 0; i < items.length; ++i) {
          var item = items[i];
          var startDate: Date = item.startDate;
          item.startDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
        }
      } else {
      }
      
      index.go(req, res);
    });
  }
};