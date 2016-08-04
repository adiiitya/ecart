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

    .controller('LoginController', function ($rootScope, $scope, toaster, $http, CommonFactory, Api, $mdDialog, $mdToast, $state) {

        $rootScope.admin = {
            email: "",
            password: ""
        };
        $http.get(Api.ecart + '/debug');
        var url = Api.ecart + '/authenticate';
        var data = $rootScope.admin;
        $scope.submit = function (ev) {
            $http.post(url, data).then(function (response) {
                if (response.data == 'Admin login')
                    console.log("Submites syccessfully");
                $state.go('ecart.categories.all');
                toaster.pop('success', "", "Login successfull");

            }, function (response) {
                toaster.pop('error', "", "User id and Password Does Not Match");
                console.log("DAta" + response.statusText)

            })

        };

    });