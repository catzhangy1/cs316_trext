'use strict';

angular.module('esfd.notify', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/notify', {
            templateUrl: '../static/js/notify.html',
            controller: 'NotifyCtrl'
        });
    }])

    .controller('NotifyCtrl',
    ['$scope','$log','$http',
        function($scope, $log, $http) {
            $scope.name = '';
            $scope.rEmail = '';
            $scope.sEmail = '';

            $scope.submit = function() {
                if($scope.name == '' && $scope.rEmail == '' && $scope.sEmail == ''){
                    return;
                }

                $log.log($scope.name);
                $log.log($scope.rEmail);
                $log.log($scope.sEmail);
                var data = [$scope.name, $scope.rEmail, $scope.sEmail];
                var obj = {name: $scope.name, rEmail: $scope.rEmail, sEmail: $scope.sEmail};
                $log.log(data.join(" "));
                $http({method: "POST", url:"/notify", data:data}).
                    success(function(results){
                        $log.log(results);
                        $scope.message = "Success!";
                        $scope.list = results;

                    }).
                    error(function(error){
                        $scope.message = "Failure! Please try again later";
                        $log.log(error);
                    });
            }
        }
    ]);