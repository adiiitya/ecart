/**
 * Created by okagour on 19-07-2016.
 */
angular.module('ecart.categories', ['ecart.categories.product'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('ecart.categories', {
                url: '/category',
                abstract: true
            })


            .state('ecart.categories.all', {
                url: '/list',
                views : {
                    "@": {
                        templateUrl: "categories/categories.html",
                        controller:'CategoriesController'

                    }
                }
                //controller:'allCategoriesController'
            })
            .state('ecart.categories.create', {
                url: '/create',
                params:{
                  mode:'create'
                },
                views : {
                    "@": {
                        templateUrl:'categories/createCategory.html',
                        controller:'CreateCategoriesController'
                    }
                }
            })
            .state('ecart.categories.edit', {
                url: '/edit/:cId',
                params:{
                  mode:'edit'
                },
                views : {
                    "@": {
                        templateUrl:'categories/createCategory.html',
                        controller:'CreateCategoriesController'
                    }
                }
            })
            .state('ecart.categories.all.list',{
                url:'/arrival/list',

                views:{
                    "@":{
                        templateUrl:'categories/allOrder.html',
                        controller:'listOrder'
                    }
                }
            })
            .state('ecart.categories.all.create',{
                url:'/arrival/create',

                views:{
                    "@":{
                        templateUrl:'categories/newArrival.html',
                        controller:'createOrder'
                    }
                }
            })
            .state('ecart.categories.all.edit',{
                url:'/arrival/edit/:oId',

                views:{
                    "@":{
                        templateUrl:'categories/newArrival.html',
                        controller:'createOrder'
                    }
                }
            })



    });
