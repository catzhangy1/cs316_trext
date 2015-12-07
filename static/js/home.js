//'use strict';
//
//angular.module('esfd.home', ['ngRoute'])
//
//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider.when('/home', {
//            templateUrl: '../static/js/home.html',
//            controller: 'HomeCtrl'
//        });
//    }])
//
//    .controller('HomeCtrl', ['$scope','$log', '$window', '$http', function($scope, $log, $window, $http ) {
//        $log.log('launched');
//        $scope.getResults = function (){
//            $log.log("test");
//            console.log('test');
//            $http.get('/search',null).
//                success(function(results){
//                $log.log(results);
//                    $window.location.path = ('/results');
//            }).
//            error(function(error){
//                $log.log(error);
//            });
//        };
//    }]);

//(function ($) {
//
///**
//* @function
//* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
//* @param {function} handler A function to execute at the time when the element is inserted
//* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
//* @example $(selector).waitUntilExists(function);
//*/
//
//$.fn.waitUntilExists    = function (handler, shouldRunHandlerOnce, isChild) {
//    var found       = 'found';
//    var $this       = $(this.selector);
//    var $elements   = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
//
//    if (!isChild)
//    {
//        (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
//            window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
//        ;
//    }
//    else if (shouldRunHandlerOnce && $elements.length)
//    {
//        window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
//    }
//
//    return $this;
//}
//
//}(jQuery));
//
//$( document ).ready( function() {
//  var myTimeout;
//  $(".title").waitUntilExists(function () {
//    $('.title').mouseenter(function() {
//      myTimeout = setTimeout(function() {
//          $("#t").animate({width:"40px", opacity:"1"}, 100);
//          $("#hit").css("margin-right","0px");
//          $(".b").css("transform","scale(1,0)");
//          $(".c").css("transform","scale(1,1)");
//          $(".d").css("transform","scale(1,1)");
//          $("#jetBlue").css("opacity","1");
//      }, 5000);
//    }).mouseleave(function() {
//      clearTimeout(myTimeout);
//      $("#t").animate({width:"0px", opacity:"0"}, 100);
//      $("#hit").css("margin-right","-60px");
//      $(".b").css("transform","scale(1,1)");
//      $(".c").css("transform","scale(1,0)");
//      $(".d").css("transform","scale(0,1)");
//      $("#jetBlue").css("opacity","0");
//    });
//  });
//});