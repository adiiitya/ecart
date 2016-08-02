/**
 * Created by okagour on 29-07-2016.
 */
angular.module('ecart.users',[])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ecart.users', {
                url: '/user',
                abstract: true
            })
            .state('ecart.users.all', {
                url: '/list',
                views : {
                    "@": {
                        templateUrl: "users/allUsers.html",
                        controller:'UsersController'

                    }
                }
            })
            .state('ecart.users.edit', {
                url: '/edit/:uId',
                views : {
                    "@": {
                        templateUrl:'categories/editUser.html',
                        controller:'UsersController'
                    }
                }
            })
    })