'use strict';

angular.module('ecart.home', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: "login/login.html",
                controller: 'LoginController'


            })
    })
    /*.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/home1.html',
            controller: 'View1Ctrl'
        });
    }])*/

    .controller('LoginController', function ($scope,$http,CommonFactory,Api, $state) {

        $scope.admin={
            email:"",
            password:""
        }
        var url= Api.ecart+'/auth/login';
       var data= $scope.admin;
        $scope.submit = function () {
            $state.go('ecart.categories.all');

            $http.post(url,data)
                .success(function (data, status, headers, config) {
                    console.log("Sucesss"+data)
                    $state.go('ecart.categories.all');

                })
                .error(function (data, status, header, config) {
                })


            //CommonFactory.users.admin()
            //    .then(function (adminData) {
            //        $scope.admin=adminData.data;
            //        $state.go('ecart.categories.all');
            //
            //    })
        };
        console.log("Home");

    });