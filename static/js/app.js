angular.module('app', [
    'ngRoute',
    'ngMaterial',
    'app.controllers'
])
    .constant('USER_ROLES', {
        all : '*',
        admin : 'admin',
        editor : 'editor',
        guest : 'guest'
    }).constant('AUTH_EVENTS', {
        loginSuccess : 'auth-login-success',
        loginFailed : 'auth-login-failed',
        logoutSuccess : 'auth-logout-success',
        sessionTimeout : 'auth-session-timeout',
        notAuthenticated : 'auth-not-authenticated',
        notAuthorized : 'auth-not-authorized'
    })
    .service('dataService', function() {
      //var data = [];
      //var soContent = {
      //  senderName:"",
      //  senderEmail:"",
      //  receiverEmail:""}
      //var subscribeContent = {
      //  name: "",
      //  email: "",
      //  phone: "",
      //  origin: "",
      //  destination: "",
      //  hotel_nights: 0,
      //  hotel_check_in_date: new Date(),
      //  tolerance: 0,
      //  max_price: 0,
      //}
      var _locations = [];
      var _destinations = [];
      var _activities = [];
      var _maxdest = 3;
      return {
        addResult: function(result){
          //  var parsed = result.split("*");
          //  var result = {
          //    "Origin": parsed[0],
          //    "Destination": parsed[1],
          //    "Hotel": parsed[2],
          //    "Nights": parsed[3],
          //    "CheckIn": parsed[4],
          //    "CheckOut": parsed[5],
          //    "Expedia": parsed[6],
          //    "JetBlue": parsed[7],
          //    "Save": parsed[8],
          //    "Month": parsed[9],
          //    "AdvanceWeeks": parsed[10]
          //  }
          //data.push(result);
        },
        updateTripInput: function(location, destinations, activities, maxdest){
            _locations = location;
            _destinations = destinations;
            _activities = activities;
            _maxdest = maxdest;

        },
          resetTripInput: function(){

          },
        clearResult: function(result){
            _locations = [];
            _destinations = [];
            _activities = [];
            _maxdest = 3;
        },
          getTripInput: function(){
              return [_locations,_destinations, _activities, _maxdest];
          },

      }
    })
    .config(['$routeProvider', function($routeProvider){

        $routeProvider.when('/home', {
            templateUrl:'../static/partials/home.html',
            controller:'HomeCtrl'
        }).when('/post', {
            resolve:{
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'views/post.html',
            controller: 'PostController'
        }).when('/post/:id', {
            resolve:{
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'views/singlepost.html',
            controller: 'SinglePostController'
        }).when('/page/:id', {
            resolve:{
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'views/page.html',
            controller: 'PageController'
        }).when('/explore', {
            resolve:{
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'views/explore.html',
            controller: 'NavigationController'
        }).when('/editor', {
            resolve:{
                "check": function($location, $rootScope){
                    if(!$rootScope.loggedIn){
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'views/editor.html',
            controller: 'TagsController'
        }).when('/editor', {
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.loggedIn) {
                        $location.path('/');
                    }
                }
            },
            templateUrl: '../static/partials/notify.html',
            controller: 'NotifyCtrl'
        }).when('/plan', {
            templateUrl: '../static/partials/plan.html',
            //controller: 'EditorController'
        }).when('/plan-result', {
            templateUrl: '../static/partials/plan-result.html',
            controller: 'PlanResultController'
        }).otherwise({
            redirectTo: '/'
        });

    }]);

