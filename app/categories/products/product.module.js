/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.categories.product', [])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('ecart.categories.product', {
                url: '/:categoryId/product',
                abstract: true
            })
            .state('ecart.categories.product.list', {
                url: '/list',
                views: {
                    "@": {
                        templateUrl: "categories/products/viewProduct.html",
                        controller: 'ProductController'

                    }
                }
            })
            .state('ecart.categories.product.view', {
                url: '/view/:id',
                views: {
                    "@": {
                        templateUrl: "categories/products/viewProduct.html",
                        controller: 'ProductController'

                    }
                }
            })
            .state('ecart.categories.product.edit', {
                url: '/edit/:id',
                params:{
                    mode:'edit'
                },
                views: {
                    "@": {
                        templateUrl: "categories/products/editProduct.html",
                        controller: 'createProductController'

                    }
                }
            })
            .state('ecart.categories.product.new',{
                url:'/new/:categoryId',
                params:{
                    mode:'create'
                },
                views:{
                    "@":{
                        templateUrl:"categories/products/createProduct.html",
                        controller: 'createProductController'
                    }
                }
            })
    });
