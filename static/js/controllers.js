angular.module('app.controllers', [

])

    .controller('PostController', ['$scope', '$http', function($scope, $http){

        $http.get('data/posts.json').success(function(data){

            $scope.posts = data;

        });
    }])

    .controller('SinglePostController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('data/posts.json').success(function(data){

            $scope.post = data[$routeParams.id];

        });

    }])

    .controller('PageController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('data/pages.json').success(function(data){

            $scope.page = data[$routeParams.id];

        });
    }])

    .controller('NavigationController', ['$scope', '$http', function($scope, $http){

        $http.get('data/attractions.json').success(function(data){

            $scope.attractions = data;

        });

        $scope.random = function(){
            return 0.5 - Math.random();
        };

    }])

    .controller('TagsController', ['$scope', '$http', function($scope, $http){
        $scope.inputTags = [];

        $scope.addTag = function() {
            if ($scope.tagText.length == 0) {
                return;
            }
            $scope.inputTags.push({name: $scope.tagText});
            $scope.tagText = '';
        }
        $scope.deleteTag = function(key) {
            if ($scope.inputTags.length > 0 &&
                $scope.tagText.length == 0 &&
                key === undefined) {
                $scope.inputTags.pop();
            } else if (key != undefined) {
                $scope.inputTags.splice(key, 1);
            }
        }


        $http.get('data/posts.json').success(function(data){

            $scope.posts = data;

        });
    }])

    .controller('LoginController', function ($scope, $location, $rootScope) {
        $scope.submit = function () {

            console.log("test");
            if($scope.username == 'admin' && $scope.password == 'admin'){
                console.log("here");
                $rootScope.loggedIn = true;
                $location.path('/post')
            }else{
                alert('Wrong Password');
            }
        };
    })

    .controller('HomeCtrl', ['$scope','$log', '$window', '$http', function($scope, $log, $window, $http ) {
        $log.log('launched');
        $scope.getResults = function (){
            $log.log("test");
            console.log('test');
            $http.get('/search',null).
                success(function(results){
                    $log.log(results);
                    $window.location.path = ('/results');
                }).
                error(function(error){
                    $log.log(error);
                });
        };
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
    ])

    .controller('EditorController', function ($scope, $location, $rootScope, $log, $http, $window, dataService) {
        $scope.autocompleteDemoRequireMatch = true;
        $scope.readonly = false;

        $http.get('../static/categories.json').success(function(data){
            $scope.categories = data.map(function (veg) {
                veg._title = veg.title.toLowerCase();
                veg._alias = veg.alias;
                veg._parent = veg.parents[0] ? veg.parents[0].toUpperCase() : "";
                return veg;
            });
        }).error(function(error){
                $scope.autocompleteDemoRequireMatch = false;
            });

        $scope.prices = [{'price':"$",'selected':'false'},
            {'price':"$$",'selected':'false'},
            {'price':"$$$",'selected':'false'},
            {'price':"$$$$",'selected':'false'}];


        const data = dataService.getTripInput();
        $scope.locations = data[0];
        $scope.destinations = data[1];
        $scope.activities = data[2];
        $scope.maxdest = data[3];

        $scope.selectedItem = null;
        $scope.selectedText = null;


        createFilterFor = function(query){
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(category) {
                return (category._title.indexOf(lowercaseQuery) === 0);
            };
        },

        randomize  = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        $scope.querySearch = function(query){
            var results = query ? $scope.categories.filter(createFilterFor(query)) : [];
            return results;
        };


        $scope.submit = function(){
            dataService.updateTripInput($scope.locations, $scope.destinations, $scope.activities, $scope.maxdest);

            var truncated = $scope.activities.map(function(obj) {return obj.alias});
            var data = [$scope.locations.join("*"), $scope.destinations.join("*"), truncated.join("*"), $scope.maxdest];
            $log.log(data);
            //$http({method: "GET", url:"/search", data:data}).
            //    success(function(results){
            //        $log.log(results);
            //    }).
            //    error(function(error){
            //        //$scope.message = "Failure! Please try again later";
            //        $log.log(error);
            //    });
            $http({method:'POST', url: '/search', data : data, responseType:'json'}).
                success(function(results){
                    $log.log(results);
                    //$window.location.path = ('/results');
                }).
                error(function(error){
                    $log.log(error);
                });
            //var landingUrl = "http://" + $window.location.host + "/#/plan-result";
            //$window.location.href = landingUrl;

        };

        $scope.randomize = function(){
            const destinations = ["Berkeley, CA", "Durham, NC", "New York, NY", "San Francisco, CA"];
            $scope.locations = [destinations[randomize(0,4)]];

            $scope.activities = [];
            for(var i = 0; i < randomize(2,6); i++){
                $scope.activities.push($scope.categories[randomize(0, $scope.categories.length)]);
            }

            for(var i = 0; i < 4; i++){
                $scope.prices[i].selected=false;
            }
            $scope.prices[randomize(0,3)].selected = true;

            $scope.maxdest = randomize(1, 6);
        };

        $scope.reload = function(){
            $window.location.reload();
        };

    })

    .controller('PlanResultController', function ($scope, $location, $rootScope, $log, dataService) {
        $log.log(dataService.getTripInput());

    })


;