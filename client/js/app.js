var CENForms = angular.module('CENForms', ['ngResource'])

CENForms.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {controller: ListCtrl, templateUrl: '/partials/list.html'})
    .when('/edit/:id', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .when('/new', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .otherwise({redirectTo: '/'});
//  $locationProvider.html5Mode(true)
})


CENForms.factory('FormsService', function($resource) {
//  return $resource('/api/forms/:id', {id: '@id'}, {update: {method: 'PUT'}})
  return $resource('/api/forms/:id', {id: '@id'})
})

CENForms.factory('DictionariesService', function($resource) {
  return $resource('/api/dictionaries')
})

function int(str) {
  return parseInt(str, 10);
}
function isEmpty(value) {
  return isUndefined(value) || value === '' || value === null || value !== value;
}
function isUndefined(value){return typeof value == 'undefined';}
CENForms.directive('minLengthExpr', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: {
      pre: function(scope, elm, attr, ctrl) {
        
      },
      post: function(scope, elm, attr, ctrl) {
        if (attr.minLengthExpr) {
          var maxLengthValidator = function(value) {
            var maxlength = int(scope.$eval(attr.minLengthExpr));
            if (!isEmpty(value) && value.length > maxlength) {
              ctrl.$setValidity('maxlength', false);
              return undefined;
            } else {
              ctrl.$setValidity('maxlength', true);
              return value;
            }
          };

          ctrl.$parsers.push(maxLengthValidator);
          ctrl.$formatters.push(maxLengthValidator);
        }
      }
    }
  }
})

CENForms.directive('formfield', function() {
  return {
    restrict: 'C',
    require: '^form',
    scope: {
      prop:  '@',
      label: '@',
      max: '=',
      data: '=ngModel'
    },
    templateUrl: '/partials/formfield.html',
    replace: true,
    /*link: {
      pre: function(scope, elm, attr, ctrl) {
        console.log("PRE" + attr.max);
        attr.ngMaxlength = attr.max;
        console.log(attr);
      },
      post: function(scope, elm, attr, ctrl) {
        console.log("POST");
        console.log(attr);
      }
    }*/
    link: function(scope, elm, attr, ctrl) {
      scope.eForm = ctrl;
//      console.log(scope);
//      console.log(elm);
//      console.log(attr);
      console.log(ctrl);
    }
  }
})

CENForms.directive('formfield2', function() {
  return {
    restrict: 'C',
    scope: {
      prop:  '@',
      label: '@',
    },
    transclude: true,
    templateUrl: '/partials/formfield2.html',
    replace: true
  }
})

CENForms.directive('formtable', function() {
  return {
    restrict: 'C',
    scope: {
      showarea: '=showarea',
      formdata: '=formdata'
    },
    templateUrl: '/partials/formTable.html'
  }
})