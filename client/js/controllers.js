function ListCtrl ($scope, $http, FormsService) {
  $scope.forms = FormsService.query();
  
  $scope.index = -1;
 
  $scope.select = function (index) {
    $scope.index = index;
  }
}

function EditCtrl ($scope, $location, $routeParams, FormsService) {
  var id = $routeParams.id
  /*FormsService.get({id: id}, function(resp) {
    $scope.car = resp.content  
  })
  //$scope.car = CarsService.get({id: id})
  $scope.action = "Update"

  $scope.save = function() {
    CarsService.update({id: id}, $scope.car, function() {
      $location.path('/')
    })
  }*/
}