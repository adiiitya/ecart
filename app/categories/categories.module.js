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




    });
