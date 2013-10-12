var CENForms = angular.module('CENForms', ['ngResource'])

CENForms.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {controller: ListCtrl, templateUrl: '/partials/list.html'})
    .when('/edit/:id', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true)
})

//CENForms.factory('FormsService')
CENForms.factory('FormsService', function($resource) {
  return $resource('/api/forms/:id', {id: '@id'}, {update: {method: 'PUT'}})
})