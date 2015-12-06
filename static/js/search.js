'use strict';

angular.module('esfd.search', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: '../static/js/search.html',
            controller: 'SearchCtrl'
        });
    }])

    .controller('SearchCtrl', ['$scope','$log', 'dataService', '$http', function($scope, $log, dataService, $http ) {
            $http.get('/search',null).
                success(function(results){
                    dataService.clearResult();
                    dataService.addResult(results);
                }).
                error(function(error){
                    $log.log(error);
                });

    }]);