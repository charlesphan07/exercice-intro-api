// public/core.js
var messages = angular.module('messages', []);
function mainController($scope, $http) {
    $scope.formData = {};

    


    var rafraichir = function() {
    $http.get('/api/etudiants')
        .success(function(data) {
            $scope.etudiants = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  };
  var timer = setInterval(function() {
    $scope.$apply(rafraichir);
  }, 5000);
  rafraichir();
}