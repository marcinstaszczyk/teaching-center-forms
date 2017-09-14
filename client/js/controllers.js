function GlobalCtrl ($rootScope, $scope, $location, LoginService, AuthService, FlashService) {
  LoginService.get(function (resp) {
    AuthService.setUser(resp.content);  
  });
  
  $scope.loginData = {};
  $scope.login = function (login, password) {
    LoginService.save({login: login, password: password}, function (resp) {
      if (!resp || !resp.code) {
        FlashService.showError(resp.err);
        return;
      }
      FlashService.cleanMessages();
      AuthService.setUser(resp.content);
      
      $scope.loginData = {};
      $location.path('/list');
    });
  }
}

function ListCtrl ($scope, $location, FormsService) {
  $scope.forms = FormsService.query();
  
  $scope.index = -1;
  $scope.formId = null;
  $scope.showdatails = false;
 
  $scope.select = function (index) {
    $scope.deleteFirstClicked = false;
    $scope.index = index;
    $scope.formId = $scope.forms[index].id;
  }
  $scope.deleteFirst = function() {
    $scope.deleteFirstClicked = true;
  }
  $scope.delete = function() {
    if ($scope.index > 0 && $scope.formId) {
      FormsService.delete({id: $scope.formId})
      $scope.forms.splice($scope.index, 1);
      
      $scope.deleteFirstClicked = false;
      $scope.index = -1;
      $scope.formId = null;
    }
  }
  $scope.toggleArea = function () {
    $scope.showdatails = !$scope.showdatails;
  }
}

function EditCtrl ($scope, $location, $routeParams, $http, FormsService, DictionariesService, FlashService) {
  var id = $routeParams.id;
  
  var dict = DictionariesService.get(function() {
    var areas = [];
    for (var i = 0; i < dict.sAreas.length; ++i) {
      var group = dict.sAreas[i];
      for (var j = 0; j < group.sub.length; ++j) {
        areas.push({group: group.name, name: group.sub[j]});
      }
    }
    dict.sAreas = areas;
  });
  $scope.dictionaries = dict;
  
  $scope.dateOptions = {
    /*changeYear: true,
    changeMonth: true,
    yearRange: '2013:-0',*/
    dateFormat: 'dd.mm.yy',
    minDate: 0,
    maxDate: "+1Y"
  };
  
  if (id) {
    FormsService.get({id: id}, function(resp) {
      prepareForm($scope, FlashService, resp.content);
    })
  } else {
    prepareForm($scope, FlashService, {});
  }
  
  $scope.loadForUUID = function() {
    var uuid = $scope.uuidToLoad;
    FormsService.get({id: 0, uuid: uuid}, function(resp) {
      if (resp.code) {
        prepareForm($scope, FlashService, resp.content);
      } else {
        $scope.error = resp.err;
      }
    }, function(error) {
      $scope.error = error.data;
    });
  }
  
  $scope.showIndex = false;
  $scope.toggleIndex = function () {
    $scope.showIndex = !$scope.showIndex;
  }
  $scope.indexChange = function(indexValue, checked) {
    $scope.formData.indexMap[indexValue] = checked;
    if (checked) {
      $scope.formData.index.push(indexValue);
    } else {
      var i = jQuery.inArray(indexValue, $scope.formData.index);
      $scope.formData.index.splice(i, 1);
    }
//    $scope.frm.index.$error.max = ($scope.formData.index.length > 4);
    $scope.frm.index.$setValidity('max', $scope.formData.index.length <= 4);
    console.log($scope.frm.index.$error);
  }
  
  $scope.submit = function() {
    var formId = $scope.formData.id;
    FormsService.save($scope.formData, function(resp) {
      if (!resp || !resp.code) {
        $scope.error = resp.err;
        return;
      }
      prepareForm($scope, FlashService, resp.content);
      
      $scope.success = formId ? "Forma została zmieniona" : "Forma została dodana. Aby w przyszłości móc poprawić formę proszę zapisać kod: " + resp.content.uuid;
      $scope.enableNewFormButton = true;
    });
  }
  
  $scope.save = function() {
    if ($scope.frm.$valid) {
      var formId = $scope.formData.id;
      FormsService.save($scope.formData, function(resp) {
        if (!resp || !resp.code) {
          $scope.error = resp.err;
          return;
        }
        prepareForm($scope, FlashService, resp.content);
        
        $scope.success = formId ? "Forma została zmieniona" : "Forma została dodana. Aby w przyszłości móc poprawić formę proszę zapisać kod: " + resp.content.uuid;
        $scope.enableNewFormButton = true;
      });
    } else {
      angular.forEach($scope.frm, function (item) {
        item.$dirty = true;
        //item.$pristine = false;
      });
      $scope.saveTry = true
    }
  }
  
  $scope.newForm = function() {
    $scope.frm.$pristine = true;
    $scope.frm.$dirty = false;
    angular.forEach($scope.frm, function (item) {
      item.$dirty = false;
      item.$pristine = true;
    });
    
    prepareForm($scope, FlashService, {});
    delete $scope.enableNewFormButton;
  }
}

function prepareForm($scope, FlashService, formData) {
  FlashService.cleanMessages();
  delete $scope.success;
  
  $scope.formData = formData;
  
  if (formData.startDate) {//konwertujemy po wstawieniu do $scope bo wstawienie wcześniej przerabia Date() na postać "2013-11-21T00:00:00.000Z"
    formData.startDate = new Date(formData.startDate);
  }
  
  //przygotowujemy strukrure dany do checkbox-ów z indeksami
  formData.indexMap = {};
  if (!formData.index) {
    formData.index = [];
  }
  if (formData.index) {
    for(var i = 0; i < formData.index.length; ++i) {
      formData.indexMap[formData.index[i]] = true;
    }
  }
}
