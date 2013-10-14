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
  
//  console.log($location);
//  console.log(JSON.stringify($routeParams));
//  console.log($location.path());
  var id = $routeParams.id;
  if (id) {
    FormsService.get({id: id}, function(resp) {
      $scope.formData = resp.content  
    })
  } else {
    $scope.formData = {};
  }
  $scope.save = function() {
    FormsService.save($scope.formData, function() {//TODO err
      $location.path('/')
    })
  }
  
  
  /*
  //$scope.car = CarsService.get({id: id})
  $scope.action = "Dodaj"
  */
  
}