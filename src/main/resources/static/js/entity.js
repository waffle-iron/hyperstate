var app = angular.module('hyperstate', []);

app.config(function($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    // $httpProvider.defaults.cache=false;
    // $httpProvider.defaults.headers.common.Accept =
    // 'application/vnd.siren+json';
    // //initialize get if not there
    // if (!$httpProvider.defaults.headers.get) {
    // $httpProvider.defaults.headers.get = {};
    // }
    //
    // // Answer edited to include suggestions from comments
    // // because previous version of code introduced browser-related errors
    //
    // //disable IE ajax request caching
    // $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul
    // 1997 05:00:00 GMT';
    // // extra
    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});

function getLocation(href) {
    console.log("getLocation(" + href + ")");
    var location = document.createElement("a");
    location.href = href;
    // IE doesn't populate all link properties when setting .href with a
    // relative URL,
    // however .href will return an absolute URL which then can be used on
    // itself
    // to populate these additional fields.
    if (location.host == "") {
        location.href = location.href;
    }
    return location;
};

app.controller('EntityController', function($scope, $http, $location, $window) {
    var controller = this;
    var loading = true;

    controller.processNavClick = function(event) {
        console.log("processNavClick");
        console.log(event);
        controller.loading = true;
        controller.entity = {};
        $http.get(event.target.href, {
            cache : false
        }).success(function(data) {
            controller.entity = data;
            controller.loading = false;
        });
    };

    $http.get($window.location.href, {
        cache : false
    }).success(function(data) {
        controller.entity = data;
        controller.loading = false;
    });

    controller.processForm = function(form) {
        console.log("processForm");
        console.log(form);
        var action = form.action;
        controller.loading = true;
        controller.entity = {};
        $http({
            method : action.method || "GET",
            url : action.href,
            data : $.param(action.fields), // pass in data as strings
            headers : {
                'Content-Type' : action.type || "application/x-www-form-urlencoded"
            }
        }).then(function successCallback(response) {

            if (response.status == 201) {
                var location = getLocation(response.headers("Location"));
                var currLoc = getLocation($location.absUrl());
                console.log("LOC: " + location);
                console.log("proto: " + location.protocol);
                console.log("host: " + location.host);
                console.log("CLOC: " + currLoc);
                console.log("Cproto: " + currLoc.protocol);
                console.log("Chost: " + currLoc.host);
                console.log("Eproto: " + (location.protocol == currLoc.protocol));
                console.log("Ehost: " + (location.host == currLoc.host));
                if (location.protocol == currLoc.protocol && location.host == currLoc.host) {

                    controller.loading = true;
                    controller.entity = {};

                    $location.url(location.pathname + location.search + location.hash);

                    $http.get(location).then(function successCallback(response) {
                        controller.entity = response.data;
                        controller.loading = false;
                    }, function errorCallback(response) {
                        controller.loading = false;
                        alert("TODO: location follow error handing");
                    });
                } else {
                    console.log("updating href LOC: " + location);
                    $window.location.href = location;
                    controller.entity = response.data;
                    controller.loading = false;
                }
            } else {
                controller.loading = false;
                alert("TODO: handle " + response.status + " responses");
            }
        }, function errorCallback(response) {
            controller.loading = false;
            alert("TODO: error handing");
        });
        return false;
    };
});