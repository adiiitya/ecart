/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.categories')
    .controller('CategoriesController', function ($scope, toaster, $filter, $cookies, $q, $interval, $base64, $mdDialog, Api, $http, $state, CommonFactory) {
        var categories;
        var self = this;
        $scope.isLoading = true;
        $scope.categoryFilter = {
            name: ""
        };
        self.activated = true;
        self.determinateValue = 30;
        $http.get(Api.ecart + '/debug');


        CommonFactory.category.getAll().then(function (categoriesData) {
            categories = angular.copy(categoriesData.data);
            var defer = $q.defer();
            var promises = [];
            /*_.each(categories, function (category) {
             promises.push(CommonFactory.category.products.all(category.id).then(function (productPromise) {
             return productPromise.data;
             }));
             });
             return $q.all(promises);
             })
             .then(function (productsData) {
             var allProducts = [];
             _.each(productsData, function (products) {
             _.each(products, function (product) {
             allProducts.push(product);

             });
             });


             _.each(categories, function (category) {
             category.products = _.where(allProducts, {categoryId: (category.id).toString()});
             });*/
            $scope.categories = categories;
            $scope.isLoading = false;
            //console.log(categories);

        });

        $scope.queryGroups = function (search) {
            return _.filter($scope.categories, function (category) {
                return category.name.toLowerCase().indexOf(search) !== -1;
            });

        };

        $scope.selectedTextChanged = function (searchText) {
            $scope.categoryFilter.name = searchText;
        };


        $scope.viewCategory = function (category) {
            $state.go('ecart.product.list');
        };

        $scope.editCategory = function (categoryId) {
            $state.go('ecart.categories.edit', {cId: categoryId});
        };
        $scope.deleteCategory = function (ev, categoryId) {
            CommonFactory.dialogBox.openDialog(ev).then(function () {
                CommonFactory.category.delete(categoryId).then(function (response) {
                    if (response.data == 'category removed') {
                        var index = _.findIndex($scope.categories, {id: categoryId});
                        $scope.categories.splice(index, 1);
                        toaster.pop('success', "", "Category Removed Successfully");
                    }
                    else {
                        toaster.pop('error', "", "You Are Logged Out,Login To delete category ");
                        $state.go('login');
                    }
                })
            });
        }

    })


    .controller('CreateCategoriesController', function ($scope, toaster, $mdDialog, $stateParams, $base64, $state, $http, CommonFactory, Api, $timeout, $cookies, $cookieStore, Upload) {
        var categoryId = $stateParams.cId;
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.cancelDiv = false;
        var cookieValue;
        var imgg = [];
        // var category;
        var categories;
        var list = [];
        $scope.category = {

            name: "",
            offer: "",
            images: [],

            types: [{
                id: "types_",
                type: ""/*,
                 value: ""*/
            }],
            defaultImageIndex: false

        }

        if (categoryId) {
            $scope.isLoading = true;
            CommonFactory.category.get(categoryId).then(function (categoriesData) {
                $scope.category = categoriesData.data;
                $scope.isLoading = false;

                _.each($scope.category.images, function (image, index) {
                    image.url = Api.image + image.url;
                    if (image.defaultImage === true) {
                        $scope.category.defaultImageIndex = index;
                    }
                });

            });
        }

        $scope.showTitle = function () {
            $scope.complete = true;
        };


        $scope.uploadImage = function (images) {
            if (images && images.length != 0) {
                $scope.category.images = [];
                angular.forEach(images, function (data, index) {
                    var $reader = new FileReader(), result, $imageElement;

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;
                        imgg.push(result);

                    };
                    $reader.onloadend = function (e) {

                        $timeout(function () {
                            $scope.category.images.push({
                                'url': result,
                                'imageName': $scope.category.name + '-' + index,
                                'defaultImage': index === 0

                            });
                        })

                    };

                    // read file
                    $reader.readAsDataURL(data);
                });
                $scope.uploadedImages = (images);


            }
        };

        $scope.changeImage = function (Index) {
            var matchedImage = $scope.category;
            _.each(matchedImage.images, function (image, index) {
                matchedImage.images[index].defaultImage = (index === (Number(matchedImage.defaultImageIndex)));
            })
        }

        var data = {};
        $scope.submit = function () {
            $http.get(Api.ecart + '/debug');
            $scope.isLoading = true;
            var images;
            if ($scope.uploadedImages.length > 0) {
                images = imgg;
                data = {
                    //'mainCategory_id':$scope.category.selected,
                    'name': $scope.category.name,
                    'offer': $scope.category.offer,
                    'images': $scope.category.images,
                    'types': $scope.category.types
                    //'mainCategoryImage':$scope.category.mainCategoryImage
                };

            }
            else {
                data = {
                    //'mainCategory_id':$scope.category.selected,
                    'name': $scope.category.name,
                    'offer': $scope.category.offer,
                    'types': $scope.category.types
                };

            }
            //var images = _.union($scope.category.images,$scope.uploadedImages);

            if ($scope.mode == 'create') {
                if ($scope.uploadedImages.length == 0) {
                    toaster.pop('error', "", "Select atleast one image file")
                } else {
                    CommonFactory.category.save(data).then(function (response) {
                        console.log("Sucesss" + response)
                        $scope.isLoading = false;
                        if (response.data == 'category created') {
                            toaster.pop('success', "", response.data + 'Successfully');
                            $state.go('ecart.categories.all');

                        }
                        else {
                            toaster.pop('error', "", 'You are Logged Out, Login To Create Category');
                            $state.go('login');
                        }
                    })
                }
            }
            if ($scope.mode == 'edit') {
                CommonFactory.category.update(categoryId, data).then(function (response) {
                    console.log(imgg);
                    $scope.isLoading = false;
                    console.log("Sucesss" + response)
                    if (response.data == 'category created') {
                        toaster.pop('success', "", 'Category Updated successfully');
                        $state.go('ecart.categories.all');

                    }
                    else {
                        toaster.pop('error', "", 'You are Logged Out, Login To Update Category');
                        $state.go('login');
                    }

                })

            }
        };
        $scope.cancel = function () {
            $state.go('ecart.categories.all');
        };

        $scope.addTypes = function () {
            var length = $scope.category.types ? $scope.category.types.length + 1 : 0;
            $scope.category.types.push({
                id: "types_" + length,
                type: ""/*,
                 value: ""*/
            });
        };
        $scope.removeType = function (ev, id) {

            if ($scope.category.types.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.category.types.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });
            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {

                })
            }
        };

        $scope.removeAllTypes = function (ev) {
            if ($scope.category.types.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.category.types.splice(0, $scope.category.types.length - 1);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }
        };


    })