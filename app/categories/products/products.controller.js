/**
 * Created by okagour on 19-07-2016.
 */
angular.module('ecart.categories.product')
    .controller('ProductController', function ($scope, toaster, $http, $state, $stateParams, $mdDialog, Api, CommonFactory, Upload) {
        console.log("Product Controller");
        var categoryId = $stateParams.categoryId;
        var productId = $stateParams.id;
        $scope.isLoading = true;


        $scope.productFilter = {
            name: ""
        };
        $scope.product = {
            name: "",
            offer: "",
            price: null,
            images: [],
            description: []
        };
        $scope.uploadedImages = [];
        $scope.labels = [];
        $scope.values = [];

        var category;
        CommonFactory.category.get(categoryId)
            .then(function (categoryData) {
                category = categoryData.data;
                $scope.category = category;

                return CommonFactory.category.products.all(categoryId);
            })
            .then(function (allProduct) {
                category.products = allProduct.data;
                _.each(category.products, function (product) {
                    _.each(product.images, function (image) {
                        image.url = Api.image + image.url;
                    });
                });
                _.each(category.products, function (product) {
                    if (product.id == productId) {
                        $scope.product = product;
                        console.log($scope.product);
                    }
                });

                $scope.category = category;
                $scope.isLoading = false;

            })

        $scope.queryGroups = function (search) {
            var filteredProducts = _.filter($scope.category.products, function (product) {
                return product.name.toLowerCase().indexOf(search) !== -1;
            });
            return filteredProducts;

        };
        $scope.selectedTextChanged = function (searchText) {
            $scope.productFilter.name = searchText;
        };
        //$scope.products = allProduct.data;


        $scope.editProduct = function (id) {
            $state.go('ecart.categories.product.edit', {id: id});
        };

        $scope.newProduct = function (categoryId) {
            $state.go('ecart.categories.product.new', {categoryId: categoryId});

        };

        $scope.deleteProduct = function (ev, productId) {
            var confirm = $mdDialog.confirm({
                title: 'Would you like to delete this item',
                textContent: '',
                ariaLabel: 'Lucky day',
                targetEvent: ev,
                ok: 'Delete',
                cancel: 'Cancel'
            });
            $mdDialog.show(confirm).then(function () {
                $http.delete(Api.ecart + '/product/' + productId,{headers:{role:'admin'}}).then(function (response) {
                    if (response.data == 'product removed') {
                        var index = _.findIndex($scope.category.products, {id: productId});
                        $scope.category.products.splice(index, 1);
                        toaster.pop('success', "", "product removed successfully");
                    }
                    else {
                        toaster.pop('error', "", "You Are Logged Out,Login To delete product ");
                        $state.go('login');
                    }
                })
            }, function () {
                console.log('not delete.');
            });

        };


    })

    .controller('createProductController', function ($scope, toaster, $state, $stateParams, Api, CommonFactory, Upload, $mdDialog) {

        //var categoryId=$stateParams.categoryId;
        //var productId=$stateParams.id;
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.required = true;
        var imgg = [];
        var data = {};


        $scope.product = {
            name: "",
            offer: "",
            price: null,
            images: [],
            description: [{
                id: "desc_0",
                label: "",
                value: ""
            }]
        };


        CommonFactory.category.get($stateParams.categoryId)
            .then(function (categoryData) {
                $scope.category = categoryData.data;
            });

        if ($scope.mode == 'edit') {
            CommonFactory.category.products.get($stateParams.id)
                .then(function (productData) {
                    $scope.product = productData.data;
                    _.each($scope.product.images, function (image) {
                        image.url = Api.image + image.url;

                    });
                    console.log($scope.product.images);
                    console.log($scope.product);

                });
        }


        $scope.uploadImage = function (images) {
            if (images && images.length != 0) {

                angular.forEach(images, function (data, index) {
                    var $reader = new FileReader(), result, $imageElement;

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;
                        imgg.push(result);

                    };
                    $reader.onloadend = function (e) {
                        var container = angular.element('#image-container');

                        $imageElement = angular.element(document.createElement('img'));
                        // add the source
                        $imageElement.attr('src', result);
                        $imageElement.attr('id', "img-" + index);
                        $imageElement.attr('class', "product_image");

                        // finally add to the container
                        console.log($imageElement);
                        return container.append($imageElement);
                    };

                    // read file
                    $reader.readAsDataURL(data);
                });

                $scope.uploadedImages = images;
                $scope.product.images = {};
            }
        };

        $scope.submit = function () {
            //var images = _.union($scope.product.images,$scope.uploadedImages);
            var url, methodType, images;
            if ($scope.uploadedImages.length > 0) {
                images = imgg;
                data = {
                    'name': $scope.product.name,
                    'offer': $scope.product.offer,
                    'price': $scope.product.price,
                    'images': images,
                    'description': $scope.product.description
                }
            }
            else {
                data = {
                    'name': $scope.product.name,
                    'offer': $scope.product.offer,
                    'price': $scope.product.price,
                    'description': $scope.product.description
                }
            }

            if ($scope.mode == 'edit') {
                //     methodType = 'PUT';
                CommonFactory.category.products.update($stateParams.categoryId, $stateParams.id, data).then(function (response) {
                    if (response.data == 'product created') {
                        toaster.pop('success', "", 'Product Updated Successfully');
                        $state.go('ecart.categories.product.list', {categoryId: $stateParams.categoryId});
                    }
                    else {
                        toaster.pop('error', "", 'You are Logged Out, Login To Create Category');
                        $state.go('login');
                    }
                    console.log("Sucesss" + data)


                })
                //url= Api.ecart + '/category/'+$stateParams.categoryId+'/product/'+$stateParams.id;

            }
            else if ($scope.mode == 'create') {
                // methodType = 'POST';
                if ($scope.uploadedImages == 0) {
                    toaster.pop('error', "", "Select atleast one image file");

                }
                else {
                    CommonFactory.category.products.save($stateParams.categoryId, data).then(function (response) {
                        if (response.data == 'product created') {
                            toaster.pop('success', "", response.data + 'Successfully');
                            $state.go('ecart.categories.product.list', {categoryId: $stateParams.categoryId});
                        }
                        else {
                            toaster.pop('error', "", 'You are Logged Out, Login To Create Category');
                            $state.go('login');
                        }


                    })
                }
            }

        };

        $scope.addDescription = function () {
            var length = $scope.product.description ? $scope.product.description.length + 1 : 0;
            $scope.product.description.push({
                id: "desc_" + length,
                label: "",
                value: ""
            });
        };

        $scope.removeChoice = function (ev, id) {
            if ($scope.product.description.length > 1) {
                var confirm = $mdDialog.confirm({
                    title: 'Would you like to delete this item?',
                    ariaLabel: 'Remove',
                    targetEvent: ev,
                    ok: 'Delete',
                    cancel: 'Cancel'
                });
                $mdDialog.show(confirm).then(function () {
                    $scope.product.description.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });

            } else {
                var confirm = $mdDialog.confirm({
                    title: 'You have to add atleast one description',
                    ariaLabel: 'Remove',
                    targetEvent: ev,
                    ok: 'Ok'
                });
                $mdDialog.show(confirm).then(function () {
                });
            }
        };

        $scope.cancel = function () {
            /* $scope.product = {
             name : "",
             offer : "",
             price : null,
             images : [],
             description : [{
             id: "desc_0",
             label : "",
             value : ""
             }]
             };*/

        }


    })