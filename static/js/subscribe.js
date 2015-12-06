'use strict';

angular.module('esfd.subscribe', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/subscribe', {
            templateUrl: '../static/js/subscribe.html',
            controller: 'SubscribeCtrl'
        });
    }])

    .controller('SubscribeCtrl',
    ['$scope','$log','$http',
        function($scope, $log, $http) {
            $scope.name = '';
            $scope.sEmail = '';
            $scope.origin = '';
            $scope.dest = '';
            $scope.date = '';
            $scope.nights = 0;
            $scope.tol = 0;
            $scope.price = 0;

            $scope.submit = function() {

                var data = [$scope.name,
                $scope.sEmail,
                $scope.origin,
                $scope.dest,
                $scope.nights,
                $scope.date,
                $scope.tol,
                $scope.price];

                $log.log(data);
                $http({method: "POST", url:"/subscribe", data:data}).
                    success(function(results){
                        $log.log(results);
                    }).
                    error(function(error){
                        $log.log(error);
                    });
            }
        }
    ]);