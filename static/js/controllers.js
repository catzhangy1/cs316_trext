angular.module('app.controllers', [

])
//controller('LoginController', function ($scope, dataService, $) {
//    $scope.submit = function () {
//        var user = [];
//        user.push({
//            username: $scope.username,
//            password: $scope.password
//        });
//        var str = JSON.stringify(user);
//        $log.log(str);
//        $scope.loading = 'indeterminate';
//        $http({method: 'POST',
//            url: '/login',
//            data: str,
//            responseType: 'json',
//            ContentType: 'json/application'
//        }).success(function (results) {

//
//            $log.log(results);
//        }).error(function (error) {
//            $scope.loading = null;
//            $log.log(error);
//        });
//    };//end submit function
//
//    $scope.register = function () {
//        var user = [];
//        user.push({
//            username: $scope.username,
//            password: $scope.password
//        });
//        var str = JSON.stringify(user);
//        $log.log(str);
//        $scope.loading = 'indeterminate';
//        $http({method: 'POST',
//            url: '/register',
//            data: str,
//            responseType: 'json',
//            ContentType: 'json/application'
//        }).success(function (results) {
//            $log.log(results);
//        }).error(function (error) {
//            $scope.loading = null;
//            $log.log(error);
//        });
//    }//end register function
//})

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
        Controller for the editor environment
     */
    .controller('EditorController', function ($scope, $location, $rootScope, $log, $http, $window, dataService) {
        $scope.autocompleteDemoRequireMatch = true;
        $scope.readonly = false;
        $scope.loading = null;
        /*
        Input objects are initialized from dataService's TripInput
         */
        const data = dataService.getTripInput();
        $scope.locations = data[0];
        $scope.destinations = data[1];
        $scope.activities = data[2];
        $scope.maxdest = data[3];
        $scope.prices = data[4];
        for(var j = 0; j < $scope.prices.length; j++){
            if($scope.prices[j].selected){
                $scope.budget = j+1;
            }
        }

        $scope.tripname = "";
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

        $scope.updateCheck = function(data){
            //$log.log(data.selected);
            var index = data.price.length - 1;
            for(var i = 0; i < $scope.prices.length ; i++){
                if(i != index){
                    $scope.prices[i].selected = false;
                }
            }
            $scope.budget = index + 1;
            //$log.log($scope.budget);
        }


        $scope.submit = function(){
            var finalbudget = $scope.budget + $scope.maxdest + 2;
            dataService.updateTripInput($scope.locations, $scope.destinations, $scope.activities, $scope.maxdest, $scope.prices);
            var truncated = $scope.activities.map(function(obj) {return obj.alias});
            var data = [$scope.locations.join("*"), $scope.destinations.join("*"), truncated.join("*"), finalbudget];
            $scope.loading = 'indeterminate';
            $log.log($scope.budget);
            $log.log($scope.maxdest);
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

    .controller('DialogController', function ($scope, $mdDialog, $mdToast, dataService, $http, $log) {
        $scope.name = "";
        $scope.email = "";
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            if(answer === 'send'){
                shareTrip();
            }
            else{
                $mdDialog.hide(answer);
            }
        }

        var results = dataService.getItinerary();

        var origin = "Duke Unversity";
        var end = "UNC Chapel Hill";
        for(var i = 0; i < results.length; i++){
            if(results[i].isOrigin){
                origin = results[i].name;
            }
            if(results[i].isDestination){
                end = results[i].name;
            }
        }

        shareTrip = function() {
            var str = JSON.stringify([$scope.name, $scope.email, origin, end]);
            $log.log(str);
            $http({method: 'POST',
                url: '/email',
                data: str,
                responseType: 'json',
                ContentType: 'json/application'
            }).success(function (results) {
                //toast('Success!');
                $scope.message="SUCCESS!";
            }).error(function (error) {
                //toast('Failed. Try again!');
                $scope.message="Send failed; Try Again!";
            });
        }


    })
    /*
        Controller for plan result display/edit:
        1) Google Maps
        2) Editing destinations from proposed itinerary
        3) Saving finalized itinerary to db
     */
    .controller('PlanResultController', function ($scope, $mdDialog, $log, dataService, $window, $http, $mdMedia) {
        $scope.authenticated = dataService.getAuthentication();
        $scope.user = "testuser";
        //$scope.user = dataService.getUserInfo();
        $scope.results = dataService.getItinerary();
        $log.log($scope.results);
        $scope.delete = function (item) {
            $scope.results.pop(item);
        };
        $scope.o = $scope.results[0].name;
        $scope.d = $scope.results[1].name;
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
            var ori = {lat: $scope.results[0].latitude, lng: $scope.results[0].longitude};
            var end = {lat: $scope.results[1].latitude, lng: $scope.results[1].longitude};
            for (var i = 0; i < $scope.results.length; i++) {
                var coordinate = {lat: $scope.results[i].latitude, lng: $scope.results[i].longitude};
                if($scope.results[i].isOrigin){
                    ori = coordinate;
                } else if($scope.results[i].isDestination){
                    end = coordinate;
                } else{
                    waypts.push({
                        location: coordinate,
                        stopover: true
                    });
                }

            }
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

        function processList(){
            for(var i = 0 ; i < $scope.results.length; i++){
                if($scope.results[i].name === $scope.o){
                    $scope.results[i].isOrigin = true;
                } else{
                    $scope.results[i].isOrigin = false;
                }
                if($scope.results[i].name === $scope.d){
                    $scope.results[i].isDestination = true;
                } else{
                    $scope.results[i].isDestination = false;
                }
            }
        }

        $scope.submit = function() {
            processList();
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

        $scope.saveTrip = function(ev) {
            var userData = {username: $scope.user.username};
            var submit = $scope.results;
            submit.push(userData);
            var str = JSON.stringify(submit);
            $scope.loading = 'indeterminate';
            $http({method: 'POST',
                url: '/save',
                data: str,
                responseType: 'json',
                ContentType: 'json/application'
            }).success(function (results) {
                    showConfirm(ev);
                    $log.log(results);
            }).error(function (error) {
                    showStupid(ev);
                    $scope.loading = null;
                    $log.log(error);
            });
        };

        $scope.shareTrip = function(ev) {
            dataService.updateItinerary($scope.results);
            showAdvanced(ev);
        };
        /*
        DIALOGS TO HANDLE SAVE, SHARE, ETC.
         */
        showConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var text = "Thank you, " + $scope.user.name + "! Feel free to plan another trip, share your trip, or just explore around!"
            var confirm = $mdDialog.confirm()
                .title('Your tripped has been saved successfully!')
                .content(text)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Plan New Trip')
                .cancel('Stick Around');
            $mdDialog.show(confirm).then(function() {
                var landingUrl = "http://" + $window.location.host + "/#/plan";
                $window.location.href = landingUrl;
            }, function() {
                //do nothing!
            });
        };

        showStupid = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var text = "Sorry, " + $scope.user.name + "but we could not save your trip.";
            var confirm = $mdDialog.confirm()
                .title('Whoops!')
                .content(text)
                .ariaLabel('Bad day')
                .targetEvent(ev)
                .ok('Plan New Trip')
                .cancel('Go to Yelp');
            $mdDialog.show(confirm).then(function() {
                dataService.clearResult();
                var landingUrl = "http://" + $window.location.host + "/#/plan";
                $window.location.href = landingUrl;
            }, function() {
                $window.location.href = "http://www.yelp.com";
            });
        };

        showAdvanced = function(ev) {
            $mdDialog.show({
                templateUrl: '../static/partials/dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });
        };
    })


;