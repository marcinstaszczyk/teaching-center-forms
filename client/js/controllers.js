function ListCtrl ($scope, $http, FormsService) {
  $scope.forms = FormsService.query();
  
  $scope.index = -1;
  $scope.formId = -1;
  $scope.showArea = false;
 
  $scope.select = function (index) {
    $scope.index = index;
    $scope.formId = $scope.forms[index].id;
  }
  /*$scope.delete = function() {
    if (index >= 0) {
      CarsService.delete({id: $scope.cars[index].id})
      $scope.cars.splice(index, 1)
    }
  }*/
  $scope.toggleArea = function () {
    $scope.showArea = !$scope.showArea;
  }
}

function EditCtrl ($scope, $location, $routeParams, FormsService, DictionariesService) {
  
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
    })
  } else {
    $scope.formData = {};
  }
  $scope.save = function() {
    if ($scope.frm.$valid) {
      FormsService.save($scope.formData, function() {//TODO err
        $location.path('/')
      });
    } else {
      angular.forEach($scope.frm, function (item) {
        item.$dirty = true;
        //item.$pristine = false;
      });
      $scope.saveTry = true
    }
  }
  
  
  /*
  //$scope.car = CarsService.get({id: id})
  $scope.action = "Dodaj"
  */
  
}