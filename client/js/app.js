var CENForms = angular.module('CENForms', ['ngResource', 'ui.date'])

CENForms.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .when('/list', {controller: ListCtrl, templateUrl: '/partials/list.html'})
    .when('/edit/:id', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .when('/login', {templateUrl: '/partials/login.html'})
    .otherwise({redirectTo: '/'});
//  $locationProvider.html5Mode(true)
})


CENForms.factory('FormsService', function($resource) {
  return $resource('/api/forms/:id', {id: '@id'})
})

CENForms.factory('DictionariesService', function($resource) {
  return $resource('/api/dictionaries')
})

CENForms.factory('LoginService', function($resource) {
  return $resource('/api/login')
})

CENForms.directive('formfield', function() {
  return {
    restrict: 'C',
    require: '^form',
    scope: {
      prop:  '@',
      label: '@',
      max: '=',
      maxInfo: '@',
      data: '=ngModel'
    },
    templateUrl: '/partials/formfield.html',
    replace: true,
    link: {
      pre: function(scope, elm, attr, ctrl) {
        scope.eForm = ctrl;
      }
    }
  }
})

CENForms.directive('formfield2', function() {
  return {
    restrict: 'C',
    require: '^form',
    scope: {
      prop:  '@',
      label: '@',
      max: '=',
      maxInfo: '@',
    },
    transclude: true,
    templateUrl: '/partials/formfield2.html',
    replace: true,
    link: {
      pre: function(scope, elm, attr, ctrl) {
        scope.eForm = ctrl;
      }
    }
  }
})

CENForms.directive('formtable', function() {
  return {
    restrict: 'C',
    scope: {
      showdatails: '=showdatails',
      formdata: '=formdata'
    },
    templateUrl: '/partials/formTable.html'
  }
})