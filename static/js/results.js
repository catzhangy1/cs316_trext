'use strict';

angular.module('esfd.results', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/results', {
        templateUrl: '../static/js/results.html',
        controller: 'ResultsCtrl'
    });
}])

.controller('ResultsCtrl',
    ['$scope','$log', 'dataService', '$http', '$window',
        function($scope, $log, dataService, $http, $window) {
    $scope.reloadRoute = function() {
        $window.location.reload();
    }

    var results = dataService.getResult();
    $log.log(results);
    if (results.length > 0) {
        $scope.result = results[0];
    }else{
        $http.get('/search',null).
            success(function(results){
                dataService.addResult(results);
                results = dataService.getResult();
                $scope.result = results[0];
            }).
            error(function(error){
                $log.log(error);
            });
    }
    $scope.result = results[0];
    $log.log(results);
}]);