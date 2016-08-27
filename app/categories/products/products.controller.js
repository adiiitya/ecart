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
        $scope.products = {
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
        /*   CommonFactory.category.get(categoryId)
         .then(function (categoryData) {
         category = categoryData.data;
         $scope.category = category;

         return CommonFactory.category.products.all(categoryId)
         })*/
        CommonFactory.category.products.all().then(function (allProduct) {
            $scope.products = allProduct.data;
            _.each($scope.products, function (product) {
                _.each(product.images, function (image) {
                    image.url = Api.image + image.url;
                });
            });
            /* _.each($scope.products, function (product) {
             if (product.id == productId) {
             $scope.product = product;
             console.log($scope.product);
             }
             });*/

            $scope.category = category;
            $scope.isLoading = false;

        });

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
            $state.go('ecart.product.edit', {id: id});
        };

        /*  $scope.displayProduct=function(pId){
         $state.go('ecart.categories.product.display',{productId:pId});
         };*/

        $scope.newProduct = function (categoryId) {
            $state.go('ecart.product.new', {categoryId: categoryId});

        };

        $scope.deleteProduct = function (ev, productId) {
            CommonFactory.dialogBox.openDialog(ev).then(function () {
                CommonFactory.category.products.delete(productId).then(function (response) {
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
            });
        };


    })

    .controller('createProductController', function ($scope, $http, toaster, $state, $stateParams, Api, CommonFactory, Upload, $mdDialog, $compile, $timeout) {

        //var categoryId=$stateParams.categoryId;
        //var productId=$stateParams.id;
        $scope.row = {
            selected: undefined
        };
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.required = true;
        var menId, womenId, kidsId, othersId;
        var imageName;
        var images;
        var imgg = [];
        var data = {};
        $http.get(Api.ecart + '/debug');
        $scope.row = {
            selected: undefined
        };
        $scope.image = {
            selected: {}
        };

        $scope.product = {
            name: "",
            offer: "",
            price: null,
            brand: "",
            defaultStockIndex: false,
            productCategoryType: "",
            images: [],
            description: [{
                id: "desc_0",
                label: "",
                value: ""
            }],
            categoryTypes: [],
            stockData: [],
            productIdealFor: []
        };


        /*  CommonFactory.category.get($stateParams.categoryId)
         .then(function (categoryData) {
         $scope.category = categoryData.data;
         $scope.product.categoryTypes=$scope.category.types;
         });*/
        /* _.each($scope.product.selectedTypes, function (selectedtype) {
         selectedtype.id=$scope.type;
         })*/

        $http.get(Api.ecart + '/category/types').then(function (types) {
            $scope.product.categoryTypes = types.data;
            console.log($scope.product.categoryTypes);
        });


        if ($scope.mode == 'edit') {
            $http.get(Api.ecart + '/category/types').then(function (types) {
                $scope.product.categoryTypes = types.data;
                console.log($scope.product.categoryTypes);
            });
            CommonFactory.category.products.get($stateParams.id)
                .then(function (productData) {
                    $scope.product = productData.data;

                    _.each($scope.product.stockData, function (stock, index) {
                        if (stock.color && stock.size) {
                            $scope.colorStock = true;
                            $scope.sizeStock = true;
                            stock.id = "colorSize_" + index;

                        } else if (stock.color) {
                            $scope.colorStock = true;
                            stock.id = "color_" + index;
                        } else if (stock.size) {
                            $scope.sizeStock = true;
                            stock.id = "size_" + index;
                        } else {
                            $scope.stock = true;
                            stock.id = "stock_" + index;

                        }
                        if (stock.defaultStock === true) {
                            $scope.product.defaultStockIndex = index
                        }
                        _.each(stock.images, function (image) {
                            image.url = Api.image + image.url;
                            imgg = image;
                            if (image.defaultImage === true) {
                                stock.defaultImageIndex = index;
                                //stockId = stock.stockId;
                            }
                        })
                    })


                    _.each($scope.product.productIdealFor, function (ideal) {
                        if (ideal.value == "men") {
                            $scope.men = true;
                            menId = $scope.product.productIdealFor.indexOf(ideal);
                        }

                        if (ideal.value == "women") {
                            $scope.women = true;
                            womenId = $scope.product.productIdealFor.indexOf(ideal);
                        }
                        if (ideal.value == "kids") {
                            $scope.kids = true;
                            kidsId = $scope.product.productIdealFor.indexOf(ideal);
                        }
                        if (ideal.value == "others") {
                            $scope.others = true;
                            othersId = $scope.product.productIdealFor.indexOf(ideal);
                        }
                    });

                    console.log($scope.product.images);
                    console.log($scope.product);
                    console.log($scope.product.stockData);
                    console.log($scope.product.categoryTypes);
                });
        }
        ;


        $scope.uploadImage = function (stockIndex, images) {
            var container = angular.element('#image-container');
            //container.empty();
            if (images && images.length != 0) {

                $scope.product.stockData[stockIndex].images = [];
                _.each($scope.product.stockData, function (stock) {
                    _.each(stock.images, function (image) {
                        if (image.title) {
                            stock.images = [];
                        }
                    });
                });
                angular.forEach(images, function (image, index) {
                    var $reader = new FileReader(), result;
                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;

                    };
                    $reader.onloadend = function (e) {
                        $timeout(function () {
                            var matchedData = _.find($scope.product.stockData, function (data) {
                                if (data.color && data.size) {
                                    imageName = data.color + "-" + data.size;
                                } else if (data.color) {
                                    imageName = data.color;
                                } else if (data.size) {
                                    imageName = data.size;
                                } else {
                                    imageName = $scope.product.name;
                                }
                                if ($scope.colorStock && $scope.sizeStock) {
                                    return data.id === "colorSize_" + stockIndex;
                                } else if ($scope.colorStock) {
                                    return data.id === "color_" + stockIndex;
                                } else if ($scope.sizeStock) {
                                    return data.id === "size_" + stockIndex;
                                } else {
                                    return data.id === "stock_" + stockIndex;
                                }
                            });
                            if (matchedData) {
                                matchedData.images.push({
                                    'url': result,
                                    'imageName': imageName + '-' + stockIndex + '-' + index,
                                    'defaultImage': index === 0

                                });
                            }
                        });


                    };
                    // read file
                    $reader.readAsDataURL(image);
                });
                $scope.uploadedImages = images;
                $scope.product.images = {};
            }
            //return imgg;
        };

      /*  $scope.$watch('image.selected', function () {
            var radioButtons = angular.element("#radioButtons");
            console.log(radioButtons);
            _.each(radioButtons, function (radioButton) {
                $compile(radioButton);

            });
        });*/

        $scope.changeImage = function (stockIndex) {
            var matchedStock = $scope.product.stockData[stockIndex];
            _.each(matchedStock.images, function (image, index) {
                matchedStock.images[index].defaultImage = (index === Number(matchedStock.defaultImageIndex));
            });

        };
        $scope.changeRadio = function (index) {

            var matchedStock = $scope.product;
            _.each(matchedStock.stockData, function (stock, index) {
                matchedStock.stockData[index].defaultStock = (index === Number(matchedStock.defaultStockIndex));
            })
        };

        $scope.submit = function () {
            //var images = _.union($scope.product.images,$scope.uploadedImages);
            var url;
            $http.get(Api.ecart + '/debug');

            data = {
                'name': $scope.product.name,
                'offer': $scope.product.offer,
                'price': $scope.product.price,
                'description': $scope.product.description,
                'stockData': $scope.product.stockData,
                'productCategoryType': $scope.product.productCategoryType,
                'productIdealFor': $scope.product.productIdealFor,
                'brand': $scope.product.brand
            }

            if ($scope.uploadedImages.length <= 0) {

                data.stockData = _.map(data.stockData, function (stock) {
                    return _.omit(stock, 'images');
                });
            }


            /* _.each(data.stockData, function (stock) {
             stock.defaultStock = stock.defaultStock === 'true';
             });*/

            if ($scope.mode == 'edit') {
                //     methodType = 'PUT';
                if (imgg !== 0) {
                    CommonFactory.category.products.update($stateParams.categoryId, $stateParams.id, data).then(function (response) {
                        /*  _.each($scope.product.stocckData, function (stock) {
                         if(stock.images==null){
                         toaster.pop('error', "", "Select atleast one image file");
                         }
                         })*/
                        toaster.pop('success', "", 'Product Updated Successfully');
                        $state.go('ecart.product.list', {categoryId: $stateParams.categoryId});

                        console.log("Sucesss" + data)
                    }, function (response) {
                        toaster.pop('error', "", "Server Error")
                    })
                }
                else if ($scope.uploadedImages == 0) {
                    toaster.pop('error', "", "Select atleast one image file in each row");
                } else {
                    CommonFactory.category.products.update($stateParams.categoryId, $stateParams.id, data).then(function (response) {
                        /*  _.each($scope.product.stocckData, function (stock) {
                         if(stock.images==null){
                         toaster.pop('error', "", "Select atleast one image file");
                         }
                         })*/
                        toaster.pop('success', "", 'Product Updated Successfully');
                        $state.go('ecart.product.list', {categoryId: $stateParams.categoryId});

                        console.log("Sucesss" + data)
                    }, function (response) {
                        toaster.pop('error', "", "Server Error")
                    })
                }
            }

            else if ($scope.mode == 'create') {
                // methodType = 'POST';
                if ($scope.uploadedImages == 0) {
                    toaster.pop('error', "", "Select atleast one image file");
                }
                else {
                    CommonFactory.category.products.save($stateParams.categoryId, data).then(function (response) {
                        toaster.pop('success', "", response.data + 'Successfully');
                        $state.go('ecart.product.list', {categoryId: $stateParams.categoryId});

                    }, function (responseError) {
                        toaster.pop('error', "", "Server Error")
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
        $scope.showStock = function () {
            if ($scope.stock == true) {

                var length = $scope.product.stockData ? $scope.product.stockData.length + 1 : 0;
                pushStock('stock');

            } else {
                $scope.product.stockData.splice(0, $scope.product.stockData.length);
            }
        }

        $scope.showColorStock = function () {
            if ($scope.colorStock) {
                if ($scope.sizeStock) {
                    if ($scope.stock == true) {
                        $scope.stock = false;
                        $scope.showStock();
                    }
                    $scope.product.stockData.splice(0, $scope.product.stockData.length);

                    //var length = $scope.product.stockData ? $scope.product.stockData.length + 1 : 0;
                    pushStock('colorSize');

                } else {
                    if ($scope.stock) {
                        $scope.stock = false;
                        $scope.showStock();
                    }

                    pushStock('color');

                }


            } else {
                $scope.product.stockData.splice(0, $scope.product.stockData.length);
                if ($scope.sizeStock) {
                    pushStock('size');

                }
            }

        };
        $scope.showSizeStock = function () {
            if ($scope.sizeStock) {
                if ($scope.colorStock) {
                    if ($scope.stock == true) {
                        $scope.stock = false;
                        $scope.showStock();
                    }
                    $scope.product.stockData.splice(0, $scope.product.stockData.length);

                    pushStock('colorSize');

                } else {
                    if ($scope.stock == true) {
                        $scope.stock = false;
                        $scope.showStock();
                    }
                    pushStock('size');
                }


            } else {
                $scope.product.stockData.splice(0, $scope.product.stockData.length);
                if ($scope.colorStock) {
                    pushStock('color');

                }
            }

        };
        $scope.showColorSizeStock = function () {
            if ($scope.colorStock && $scope.sizeStock) {
                if ($scope.stock == true) {
                    $scope.stock = false;
                    $scope.showStock();
                }
                pushStock('colorSize');


            } else {
                $scope.product.stockData.splice(0, $scope.product.stockData.length);
            }

        }

        $scope.removeChoice = function (ev, id) {

            if ($scope.product.description.length > 1) {
                openDialog(ev).then(function () {
                    $scope.product.description.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });
            } else {
                openErrorDialog(ev).then(function () {

                })
            }
        };


        $scope.removeColor = function (ev, stockid, id) {
            if ($scope.product.stockData.length > 1) {
                openDialog(ev).then(function () {
                    $http.get(Api.ecart + '/stock/' + stockid);
                    $scope.product.stockData.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });

            } else {

                openErrorDialog(ev).then(function () {
                });
            }
        };


        $scope.removeSize = function (ev, id) {
            if ($scope.product.stockData.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.stockData.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }
        };
        $scope.removeColorSize = function (ev, id) {
            if ($scope.product.stockData.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.stockData.splice(id, 1);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }
        };
        $scope.removeAllDesc = function (ev) {
            if ($scope.product.description.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.description.splice(0, $scope.product.description.length - 1);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }

        };
        $scope.removeAllColor = function (ev) {
            if ($scope.product.stockData.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.stockData.splice(0, $scope.product.stockData.length);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }

        };
        $scope.removeAllSize = function (ev) {
            if ($scope.product.stockData.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.stockData.splice(0, $scope.product.stockData.length);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }

        };

        $scope.removeAllColorSize = function (ev) {
            if ($scope.product.stockData.length > 1) {
                CommonFactory.dialogBox.openDialog(ev).then(function () {
                    $scope.product.stockData.splice(0, $scope.product.stockData.length);
                }, function () {
                    console.log('not delete');
                });

            } else {
                CommonFactory.dialogBox.openErrorDialog(ev).then(function () {
                });
            }

        };

        $scope.cancel = function (id) {
            $state.go('ecart.categories.product.list', {categoryId: id});

        };


       /* function openDialog(ev) {

            var config = {
                title: 'Would you like to delete this item?',
                ariaLabel: 'Remove',
                targetEvent: ev,
                ok: 'Delete',
                cancel: 'Cancel'
            };
            var confirm = $mdDialog.confirm(config);
            return $mdDialog.show(confirm);
        };

        function openErrorDialog(ev) {

            var config = $mdDialog.confirm({
                title: 'You have to add atleast one item',
                ariaLabel: 'Remove',
                targetEvent: ev,
                ok: 'Ok'
            });
            return $mdDialog.show(config);
        };*/

        function pushStock(stockType) {
            var stock = {
                stock: "",
                images: [],
                defaultStock: ($scope.product.stockData.length === 0),
                defaultImageIndex: '0'
            };
            if (stockType == 'color') {
                stock.id = "color_" + $scope.product.stockData.length;
                stock.color = "";
            }
            else if (stockType == 'size') {
                stock.id = "size_" + $scope.product.stockData.length;
                stock.size = "";
            }
            else if (stockType == 'colorSize') {
                stock.id = "colorSize_" + $scope.product.stockData.length;
                stock.color = "";
                stock.size = "";
            }
            else if (stockType == 'stock') {
                stock.id = "stock_" + $scope.product.stockData.length;

            }
            $scope.product.stockData.push(stock);
        };
        $scope.changeMen = function () {
            var index = $scope.product.productIdealFor.indexOf('men');
            if ($scope.men) {
                $scope.product.productIdealFor.push('men')
            } else {
                $scope.product.productIdealFor.splice(menId, 1);
            }

        };
        $scope.changeWomen = function () {
            var index = $scope.product.productIdealFor.indexOf('women');
            if ($scope.women) {
                $scope.product.productIdealFor.push('women')
            } else {
                $scope.product.productIdealFor.splice(womenId, 1);
            }

        };
        $scope.changeKids = function () {
            var index = $scope.product.productIdealFor.indexOf('kids');
            if ($scope.kids) {
                $scope.product.productIdealFor.push('kids')
            } else {
                $scope.product.productIdealFor.splice(kidsId, 1);
            }

        };
        $scope.changeOther = function () {
            var index = $scope.product.productIdealFor.indexOf('others');
            if ($scope.other) {
                $scope.product.productIdealFor.push('others')
            } else {
                $scope.product.productIdealFor.splice(othersId, 1);
            }
        };

        /* $scope.edit = function (id) {
         $state.go('ecart.categories.product.edit', {id: id});
         };*/

        /*  $scope.subCategory= function (index) {
         $scope.product.selectedSubcategory=$scope.product.subCategory;
         }*/

    });



