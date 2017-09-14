/*
 * Initial version copied from 
 * http://blog.tomaka17.com/2012/12/random-tricks-when-using-angularjs/
 */
var elementsList = $();


var global = angular.module('global', []);
global.config(function($provide, $httpProvider, $compileProvider) {
  $httpProvider.responseInterceptors.push(function($timeout, $q, $location, AuthService, FlashService) {
    return function(promise) {
      return promise.then(function(successResponse) {
        //if (successResponse.config.method.toUpperCase() != 'GET')
        //  FlashService.showSuccess('success', 'alert alert-success', 5000);
        return successResponse;

      }, function(errorResponse) {
        switch (errorResponse.status) {
        case 401:
          AuthService.goToLoginPage();
          break;
        case 403:
          FlashService.showUnexpectedError('Nie masz wystarczających uprawnień');
          break;
        case 500:
          FlashService.showUnexpectedError('Server internal error: ' + errorResponse.data);
          break;
        //TODO wylistować przypadki, które obsługujemy ręcznie
        default:
          FlashService.showUnexpectedError('Error ' + errorResponse.status + ': ' + errorResponse.data);
        }
        return $q.reject(errorResponse);
      });
    };
  });

  $compileProvider.directive('appMessages', function() {
    var directiveDefinitionObject = {
      link : function(scope, element, attrs) {
        elementsList.push($(element));
      }
    };
    return directiveDefinitionObject;
  });
});

global.factory('FlashService', function($rootScope, $location) {
  var showMessage = function(content, cl, time) {
    $('<div/>')
    .addClass('message')
    .addClass(cl)
    .hide()
    .fadeIn('fast')
    .delay(time)
    .fadeOut('fast', function() {
      $(this).remove();
    })
    .appendTo(elementsList)
    .text(content);
  };
  
  return {
    showMessage: showMessage,
    showUnexpectedError: function(content) {
      showMessage(content, 'alert alert-error', 20000);
    },
    showError: function(content) {
      showMessage(content, 'alert alert-error', 5000);
    },
    showSuccess: function(content) {
      showMessage(content, 'alert alert-success', 5000);
    },
    showInfo: function(content) {
      showMessage(content, 'alert alert-info', 5000);
    },
    cleanMessages: function() {
      angular.forEach(elementsList, function(elem) {
        elem.empty();
      });
    }
  }
});

global.factory('AuthService', function($rootScope, $location, FlashService) {
  return {
    setUser: function(user) {
      $rootScope.user = user;
    },
    isUserLoggedIn: function() {
      return $rootScope.user;
    },
    goToLoginPage: function() {
      delete $rootScope.user;
      $location.path('/login');
      FlashService.showInfo('Aby kontynuować proszę się zalogować');
    }
  };
})