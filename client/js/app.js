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


CENForms.directive('formfield', function() {
  return {
    restrict: 'E',
    scope: {
      prop:  '@',
      label: '@',
      data: '=ngModel'
    },
    templateUrl: '/partials/formfield.html'
  }
})

CENForms.directive('formfield2', function() {
  return {
    restrict: 'E',
    scope: {
      prop:  '@',
      label: '@',
    },
    transclude: true,
    templateUrl: '/partials/formfield2.html'
  }
})

CENForms.directive('formtable', function() {
  return {
    restrict: 'E',
    scope: {
      showarea: '=showarea',
      formdata: '=formdata'
    },
    templateUrl: '/partials/formTable.html'
  }
})