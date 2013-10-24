function GlobalCtrl ($scope, $location, LoginService) {
  LoginService.get(function (resp) {
    $scope.user = resp.content;  
  });
  
  $scope.loginData = {};
  $scope.login = function (login, password) {
    LoginService.save({login: login, password: password}, function (resp) {
      if (!resp || !resp.code) {
        $scope.error = resp.err;
        return;
      }
      delete $scope.error;
      $scope.user = resp.content;  
      $scope.loginData = {};
      $location.path('/list');
    });
  }
}

function ListCtrl ($scope, $http, $location, FormsService) {
  if (!$scope.$parent.user) {
    $location.path('/login');
    return;
  }
  
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

function EditCtrl ($scope, $location, $routeParams, FormsService, DictionariesService) {
  $scope.showIndex = false;
  $scope.toggleIndex = function () {
    $scope.showIndex = !$scope.showIndex;
  }
  
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
  
  var id = $routeParams.id;
  if (id) {
    FormsService.get({id: id}, function(resp) {
      $scope.formData = resp.content  
      if (resp && resp.content && resp.content.startDate) {//konwertujemy po wstawieniu do $scope bo wstawienie wcześniej przerabia Date() na postać "2013-11-21T00:00:00.000Z"
        $scope.formData.startDate = new Date(resp.content.startDate);
      }
      prepareForm($scope.formData);
    })
  } else {
    $scope.formData = {};
    prepareForm($scope.formData);
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
  
  $scope.save = function() {
    if ($scope.frm.$valid) {
      FormsService.save($scope.formData, function(resp) {
        if (!resp || !resp.code) {
          $scope.error = resp.err;
          return;
        }
        $scope.success = id ? "Forma została zmieniona" : "Forma została dodana";
      });
    } else {
      angular.forEach($scope.frm, function (item) {
        item.$dirty = true;
        //item.$pristine = false;
      });
      $scope.saveTry = true
    }
  }
  
}

function prepareForm(formData) {
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

/*function emptyArray(item) {
  if (!item || isAr)
}*/