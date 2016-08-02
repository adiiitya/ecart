'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('ecart', [
    'ngAnimate', 'ngAria', 'ngMaterial', 'ui.router','ngFileUpload','ecart.common','base64','ngCookies',
    'ecart.home',
    'ecart.categories','ecart.users',
    'ecart.navigation'
]);
app.run(function ($http) {
   // $http.defaults.headers.post['Cookie'] = 'XDEBUG_SESSION=18826';
    //$http.defaults.withCredentials = true;
    //$http.defaults.headers.put["Content-Type"] = "application/json";

});
app.config(function ($httpProvider,$stateProvider, $urlRouterProvider,$locationProvider) {

    $httpProvider.defaults.withCredentials = true;

    $stateProvider
        .state('ecart', {
            url: '',
            abstract: true,
            views: {
                'navigation.header': {
                    templateUrl: "navigation/header.html",
                    controller: 'HeaderController'

                }
                //
                //'content': {
                //    templateUrl: "login/home2.html"
                //
                //}
            }
        })
       ;
    $urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(false);

});