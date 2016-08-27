/**
 * Created by okagour on 23-08-2016.
 */
angular.module('ecart.categories')
    .controller('createOrder', function ($scope,$stateParams, toaster,$state, CommonFactory, Api, $http,$timeout, $mdDialog, $q) {
        var orderId=$stateParams.oId;
        var homeData;
        var products = [];
        var subCategories = [];
        var data = {};
        var orders;
        var uploadedImages=[];
        $scope.home = {
            heading:"",
            title: "",
            offer: "",
            tag:[],
            selected:"",
            images: [],
            defaultImageIndex: false,
            selectedName:"",
            data:[]
        };

       /* $http.get(Api.ecart + '/newArrival/all/data').then(function (arrivalData) {
            homeData = arrivalData.data;
            console.log(homeData);
            $scope.home.categories=homeData.categories;
            $scope.home.categoryTypes = homeData.categoryTypes;
            $scope.home.products = homeData.products;
            $scope.home.gender=homeData.gender;
            $scope.home.brands=homeData.brands;

        })
*/
        $http.get(Api.ecart + '/debug');

        $scope.showItems=function(itemName){
          CommonFactory.newArrival.getTypes(itemName).then(function (itemData) {
               $scope.home.data=itemData.data;
               console.log($scope.home.data);
           })
       };

       /* $scope.changeIt=function(heading){
            $scope.home.heading = heading.toLowerCase().replace(/ /g,"");

        }
*/




      /*  if(orderId){
            $http.get(Api.ecart + '/newArrival/'+orderId).then(function (arrivalData) {
                orders = arrivalData.data;
                console.log(orders);
                $scope.newArrival.mainId=orders.mainCategory_id;
                $scope.newArrival.subId=orders.subCategory_id;
                var filteredSubCategories = [];
                _.each(subCategories, function (subCategory) {
                    if (subCategory.mainCategory_id === $scope.newArrival.mainId) {
                        filteredSubCategories.push(subCategory);
                    }
                    $scope.newArrival.subCategories = angular.copy(filteredSubCategories);
                });

                if(orders.product_id){
                    $scope.newArrival.productId=orders.product_id;
                    var filteredProducts = [];
                    _.each(products, function (product) {
                        if (product.subCategory_id == $scope.newArrival.subId) {
                            filteredProducts.push(product);
                        }
                        $scope.newArrival.products = angular.copy(filteredProducts);
                    });
                }
                $scope.newArrival.name=orders.name;
                $scope.newArrival.images=orders.images;
                _.each($scope.newArrival.images, function (image) {
                    image.url=Api.image+image.url;
                });
                $scope.newArrival.offer=orders.offer;
                /!*_.each(categories, function (arrivalCategories) {
                 $scope.newArrival.mainCategories = arrivalCategories;
                 console.log($scope.newArrival.mainCategories);
                 subCategories = arrivalCategories.subCategories;
                 products = arrivalCategories.products;
                 });*!/
            })

        }else{





        $scope.mainCategory = function (categoryId) {
            //cId=$scope.newArrival.mainId;
            var filteredSubCategories = [];
            _.each(subCategories, function (subCategory) {
                if (subCategory.mainCategory_id === categoryId) {
                    filteredSubCategories.push(subCategory);
                }
                $scope.newArrival.subCategories = angular.copy(filteredSubCategories);
            });

        };

        $scope.subCategory = function (subCategoryId) {
            var filteredProducts = [];
            _.each(products, function (product) {
                if (product.subCategory_id == subCategoryId) {
                    filteredProducts.push(product);
                }
                $scope.newArrival.products = angular.copy(filteredProducts);
            });
        };
        }*/

        $scope.uploadImage = function (images) {
            if (images && images.length != 0) {
                $scope.home.images = [];
                angular.forEach(images, function (data, index) {
                    var $reader = new FileReader(), result, $imageElement;

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;

                    };
                    $reader.onloadend = function (e) {

                        $timeout(function () {
                            $scope.home.images.push({
                                'url': result/*,
                                'imageName': $scope.newArrival.id + '-' + index,
                                'defaultImage': index === 0*/

                            });
                        })

                    };

                    // read file
                    $reader.readAsDataURL(data);
                });
                uploadedImages = (images);


            }
        };
        $scope.changeImage = function (Index) {
            var matchedImage = $scope.home;
            _.each(matchedImage.images, function (image, index) {
                matchedImage.images[index].defaultImage = (index === (Number(matchedImage.defaultImageIndex)));
            })
        };

        $scope.submit = function () {
            $http.get(Api.ecart + '/debug');
                if(uploadedImages.length==0){
                    data = {
                        heading: $scope.home.heading,
                        title: $scope.home.title,
                        offer: $scope.home.offer,
                        tag:$scope.home.tag,
                        selected:$scope.home.selectedName
                    }
                }else{
                    data = {
                        heading: $scope.home.heading,
                        title: $scope.home.title,
                        offer: $scope.home.offer,
                        tag:$scope.home.tag,
                        images:$scope.home.images,
                        selected:$scope.home.selectedName
                    }
                }





            /*if(orderId){

                CommonFactory.newArrival.update(orderId,data).then(function (response) {
                    if(response.data=='newArrival created')
                    {
                        toaster.pop('success', "", response.data+'Successfully');
                        $state.go('ecart.categories.all');

                    }
                    else{
                        toaster.pop('error', "",'You are Logged Out, Login To Create Category');
                        $state.go('login');
                    }
                })
            }else{*/
                if(uploadedImages.length ==0)
                {
                    toaster.pop('error',"","Select atleast one image file")
                }else{
                    CommonFactory.newArrival.save(data).then(function (response) {
                        console.log("Sucesss"+response )
                        $state.go('ecart.categories.all');

                    }, function (response) {
                        toaster.pop('error', "", "Server Error")
                    })
                }
            }


        //};


    })

    .controller('listOrder', function ($scope, toaster,$state, CommonFactory, Api, $http,$timeout, $mdDialog, $q) {
        var arrivals;
        var products = [];
        var subCategories = [];
        var data = {};
        $scope.orders = {
           list:[]
        };

        $http.get(Api.ecart + '/newArrival/list').then(function (arrivalData) {
            arrivals = arrivalData.data;
            $scope.orders.list=arrivals;

        });
        $scope.editOrder= function (id) {
            $state.go('ecart.categories.all.edit',{oId: id});
        };
        $scope.deleteOrder= function (id) {
            CommonFactory.newArrival.delete(id).then(function (res) {

            })
        }

    })