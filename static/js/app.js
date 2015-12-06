angular.module('app', [
    'ngRoute',
    'ngMaterial',
    'app.controllers'
])
    .constant('AUTH_EVENTS', {
        loginSuccess : 'auth-login-success',
        loginFailed : 'auth-login-failed',
        logoutSuccess : 'auth-logout-success',
        sessionTimeout : 'auth-session-timeout',
        notAuthenticated : 'auth-not-authenticated',
        notAuthorized : 'auth-not-authorized'
    })
    /*
    dataService binds current Itinerary and Editor objects across modules
     */
    .service('dataService', function() {
        var _locations = [];
        var _destinations = [];
         var _activities = [];
        var _maxdest = 3;
        var _itinerary = [];
        return {
            updateTripInput: function(location, destinations, activities, maxdest){
                _locations = location;
                _destinations = destinations;
                _activities = activities;
                _maxdest = maxdest;
            },
            clearResult: function(){
                _locations = [];
                _destinations = [];
                _activities = [];
                _maxdest = 3;
            },
            getTripInput: function() {
                return [_locations, _destinations, _activities, _maxdest];
            },
            addItinerary: function(data){
                _itinerary = [];
                _itinerary = data.filter(function(obj){
                    return !(obj==null);
                }).map(function(obj){
                    if(obj == null) {return; }
                      var add = obj.location.display_address.join(" ");
                      return {
                          id: obj.id,
                          name: obj.name,
                          category: (obj.categories[0][0] ? obj.categories[0][0] : ""),
                          phone: (obj.display_phone ? obj.display_phone : ""),
                          address: (add ? add : ""),
                          longitude: obj.location.coordinate.longitude,
                          latitude: obj.location.coordinate.latitude,
                          imageURL : (obj.image_url ? obj.image_url : "")
                      }
                  })
              },
              getItinerary: function(){
                  return _itinerary;
              },
              updateItinerary: function(data){
                  _itinerary = data;
              },
              clearItinerary: function(){
                  _itinerary = [];
              }
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
        }).when('/plan', {
            templateUrl: '../static/partials/plan.html',
            //controller: 'EditorController'
        }).when('/plan-result', {
            templateUrl: '../static/partials/plan-result.html',
            controller: 'PlanResultController'
        }).otherwise({
            redirectTo: '/home'
        });

    }]);

