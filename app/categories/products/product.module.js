/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.categories.product', [])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('ecart.product', {
                url: '/product',
                abstract: true
            })
            .state('ecart.product.list', {
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
            .state('ecart.product.edit', {
                url: '/edit/:id',
                params: {
                    mode: 'edit'
                },
                views: {
                    "@": {
                        templateUrl: "categories/products/editProduct.html",
                        controller: 'createProductController'

                    }
                }
            })
            .state('ecart.product.new', {
                url: '/new',
                params: {
                    mode: 'create'
                },
                views: {
                    "@": {
                        templateUrl: "categories/products/createProduct.html",
                        controller: 'createProductController'
                    }
                }
            })
           /* .state('ecart.categories.product.display',{
                url:'/display/:productId',
                params:{
                    mode:'display'
                },
                views:{
                    "@":{
                        templateUrl: "categories/products/displayProduct.html",
                        controller: 'createProductController'
                    }
                }
            })*/
    })

/*
    .directive('imageContainer', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs, ctrl) {

                function updateElementContents() {
                    var stockImageWrappers = element[0].querySelectorAll(".stock-image-wrapper");
                    _.each(stockImageWrappers, function (wrapper) {
                        var imageWrappers = wrapper.querySelectorAll(".image-wrapper");
                        _.each(imageWrappers, function (imageWrapper) {
                            var image = imageWrapper.querySelector(".product_image");
                            var imageId = image.getAttribute('id');
                            var details = imageId.split("-");
                            console.log("Stock row index = " + details[1] + " Image index = " + details[2]);
                            var radioButton = document.createElement('input');
                            radioButton.setAttribute("type", "radio");
                            radioButton.setAttribute("id", "radioButtons");
                            radioButton.setAttribute("name", "product-image-" + details[1]);
                            radioButton.setAttribute("ng-model", "image.selected[" + details[1] + "]");
                            radioButton.setAttribute("value", details[2]);
                            // bind change event
                            radioButton.on('change', scope.changeImage(details[1]));

                            // unbind event listener to prevent memory leaks
                            //scope.$on('$destroy', function () {
                            //    elem.off('change', onChange);
                            //})
                            //radioButton.setAttribute("ng-change", 'changeImage(' + details[1] + ')');
                            $compile(radioButton);
                            var imageContainer = wrapper.querySelector("#image-wrapper-" + details[1] + "-" + details[2]);
                            if (imageContainer.childNodes.length < 3) {
                                imageContainer.appendChild(radioButton);
                                //$compile(imageContainer);
                            }
                        })
                    });
                    //element.html('categories/products/createProduct.html');
                    $compile(element);
                    element.removeClass("loading-image");

                }

                if (element) {
                    updateElementContents();
                }

                scope.$watch(function () {

                    //updateElementContents();
                    return element.attr('class');
                }, function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        $compile(element);

                        updateElementContents();
                    }
                });
            }
        };
    }
*/
