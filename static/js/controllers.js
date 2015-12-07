angular.module('app.controllers', [

])
 .controller('LoginController', function ($http, $scope, $location, $rootScope, dataService) {
      console.log("test login controller")
      $scope.submit = function () {
          var user = [];
          user.push({
                username: $scope.username,
                password: $scope.password
          });
          console.log(user);
            var str = JSON.stringify(user);
            //server.log(str);
            $scope.loading = 'indeterminate';
            $http({method: 'POST',
                url: '/login',
                data: str,
                responseType: 'json',
                ContentType: 'json/application'
            }).success(function (results) {
                    if(results === "True"){
                        $rootScope.loggedIn = true;
                        dataService.authenticate({username:$scope.username});
                        alert('Login Successful');  
                         $location.path('/home');
                    }
                    else {
                        alert('Wrong Username/Password');
                    }
                    //server.log(results);
                    
            }).error(function (error) {
                    $scope.loading = null;
                    //server.log(error);
                    alert('Wrong Username/Password');
            });
          
//          for(var i=0; i<users.length;i++){
//              if($scope.username == users[i].username && $scope.password == users[i].password){
//                  console.log("password correct");
//                  $rootScope.loggedIn = true;
//                  $location.path('/post')
//              }      
//          }
//              if($rootScope.loggedIn != true){
//                alert('Wrong Password');    
//              }
        };//end submit function 
      $scope.register = function () {
            console.log("test register")
          var user = [];
          user.push({
                username: $scope.username,
                password: $scope.password
          });
            var str = JSON.stringify(user);
            console.log(str);
            $scope.loading = 'indeterminate';
            $http({method: 'POST',
                url: '/register',
                data: str,
                responseType: 'json',
                ContentType: 'json/application'
            }).success(function (results) {
                    dataService.authenticate({username:$scope.username});
                    //server.log(results);
                    alert('Registration Successful');  
                    $location.path('/home');
            }).error(function (error) {
                    $scope.loading = null;
                    //server.log(error);
                    alert('Registration Unsuccessful');
            });
//          if($scope.password!=$scope.password1){
//              alert('Passwords dont match');
//          }else{
//              users.push({
//                    username: $scope.username,
//                    password: $scope.password
//              });
//          }
//        alert('Trying to Register');
      }//end register function
    })

    /*
        Controller for landing page.
     */
    .controller('HomeCtrl', ['$scope','$log', '$window', '$http', function($scope, $log, $window, $http ) {
        $log.log('launched');
        //$scope.getResults = function (){
        //    $http.get('/search',null).
        //        success(function(results){
        //            $log.log(results);
        //            $window.location.path = ('/results');
        //        }).
        //        error(function(error){
        //            $log.log(error);
        //        });
        //};
    }])

    /*
        Controller for sharing trip via email
     */
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
    ])

    /*
        Controller for the editor environment
     */
    .controller('EditorController', function ($scope, $location, $rootScope, $log, $http, $window, dataService) {
        $scope.autocompleteDemoRequireMatch = true;
        $scope.readonly = false;
        $scope.loading = null;

        $scope.prices = [
            {'price':"$",'selected':'false'},
            {'price':"$$",'selected':'false'},
            {'price':"$$$",'selected':'false'},
            {'price':"$$$$",'selected':'false'}
        ];

        /*
        Input objects are initialized from dataService's TripInput
         */
        const data = dataService.getTripInput();
        $scope.locations = data[0];
        $scope.destinations = data[1];
        $scope.activities = data[2];
        $scope.maxdest = data[3];

        /*
        Data needed for autocomplete function
         */
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
        $scope.selectedItem = null;
        $scope.selectedText = null;


        createFilterFor = function(query){
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(category) {
                return (category._title.indexOf(lowercaseQuery) === 0);
            };
        };

        randomize  = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        $scope.querySearch = function(query){
            var results = query ? $scope.categories.filter(createFilterFor(query)) : [];
            return results;
        };

        $scope.submit = function(){
            dataService.updateTripInput($scope.locations, $scope.destinations, $scope.activities, $scope.maxdest);

            var truncated = $scope.activities.map(function(obj) {return obj.alias});
            var data = [$scope.locations.join("*"), $scope.destinations.join("*"), truncated.join("*"), $scope.maxdest];
            $scope.loading = 'indeterminate';
            $http({method:'POST',
                url: '/search',
                data : data,
                responseType:'json'
                }).success(function(results){
                    $log.log(results);
                    /*
                    Update the dataService's current Itinerary!
                     */
                    dataService.addItinerary(results);
                    $scope.loading = null;
                    var landingUrl = "http://" + $window.location.host + "/#/plan-result";
                    $window.location.href = landingUrl;

                }).
                error(function(error){
                    $scope.loading = null;
                    $log.log(error);
                });
        };

        $scope.randomize = function(){
            const destinations = ["Berkeley, CA", "Durham, NC", "New York, NY", "San Francisco, CA", "Singapore"];
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
            dataService.clearResult();
            $window.location.reload();
        };

    })

    /*
        Controller for plan result display/edit:
        1) Google Maps
        2) Editing destinations from proposed itinerary
        3) Saving finalized itinerary to db
     */
    .controller('PlanResultController', function ($scope, $location, $rootScope, $log, dataService, $window, $http) {
        $scope.results = dataService.getItinerary();

        $scope.delete = function (item) {
            $scope.results.pop(item);
        };

        /*
        Google maps function
         */
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;

        var mapOptions = {
            zoom: 12,
            center: {lat: $scope.results[0].latitude, lng: $scope.results[0].longitude},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap($scope.map);

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var waypts = [];

            for (var i = 2; i < $scope.results.length; i++) {
                var ori = {lat: $scope.results[i].latitude, lng: $scope.results[i].longitude};
                waypts.push({
                    location: ori,
                    stopover: true
                });
            }

            //waypts.push({
            //    location: "Duke University, Durham",
            //    stopover: false
            //});
            var ori = {lat: $scope.results[0].latitude, lng: $scope.results[0].longitude};
            var end = {lat: $scope.results[1].latitude, lng: $scope.results[1].longitude};
            directionsService.route({
                origin: ori,
                destination: end,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        }
        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info){
            $log.log(info);
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                title: info.name
            });
            //marker.content = '<div class="infoWindowContent">' + info.desc + '<br />' + info.lat + ' E,' + info.long +  ' N, </div>';

            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>');
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        };

        for (i = 0; i < $scope.results.length; i++){
            $log.log(i);
            createMarker($scope.results[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        function setMapOnAll(map) {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(map);
            }
        }

        function clearMarkers() {
            setMapOnAll(null);
        }

        $scope.submit = function() {
            clearMarkers();
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        }

        /*
        END GOOGLE MAPS
         */
        $scope.navigateBack = function() {
            dataService.clearItinerary();
            var landingUrl = "http://" + $window.location.host + "/#/plan";
            $window.location.href = landingUrl;
        };

        $scope.saveTrip = function() {
            var str = JSON.stringify($scope.results);
            $log.log(str);
            $scope.loading = 'indeterminate';
            $http({method: 'POST',
                url: '/save',
                data: str,
                responseType: 'json',
                ContentType: 'json/application'
            }).success(function (results) {
                    $log.log(results);
            }).error(function (error) {
                    $scope.loading = null;
                    $log.log(error);
            });
        };
    })

;