'use strict';

angular.module('esfd.notify', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/notify', {
            templateUrl: '../static/js/notify.html',
            controller: 'NotifyCtrl'
        });
    }])
