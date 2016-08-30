/**
 * Created by okagour on 23-08-2016.
 */
angular.module('ecart.categories')
    .controller('createOrder', function ($scope,$stateParams,$element, toaster,$state, CommonFactory, Api, $http,$timeout, $mdDialog, $q) {
        var orderId=$stateParams.oId;
        var data = {};
        var uploadedImages=[];
        var categoryTypes=[];
        var products=[];
        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });
        $scope.home = {
            heading:"",
            title: "",
            offer: "",
            tag:[],
            selected:"",
            images: [],
            defaultImageIndex: false,
            selectedName:"",
            data:[],
            categoryType:"",
            selectedCategoryType:"",
            selectedProducts:"",
            products:""
            //gender:"",
            //selectedGender:""
        };

        $http.get(Api.ecart + '/debug');

        $scope.showItems=function(itemName){
          CommonFactory.newArrival.getTypes(itemName).then(function (itemData) {
              if(itemName=='categoryName'){
                  $scope.home.data=itemData.data.categoryName;
                  categoryTypes=itemData.data.categoryType;
              }else{
                  $scope.home.data=itemData.data.productBrand;
              }
              /* $scope.home.data=itemData.categoryName;
               console.log($scope.home.data);*/
              //if(itemName=='brands'){
              //    $scope.home.products=itemData.products;
              //}else{
              //    $scope.home.categoryType=itemData.categoryTypes;
              //    $scope.home.products=itemData.products;
              //}
           })
       };

        $scope.selectCategoryType=function(){
            $scope.home.selectedCategoryType=[];
            if($scope.home.selectedName=='categoryName'){
                var filteredTypes=[];
                _.each(categoryTypes,function(type){
                    if(type.category_id==$scope.home.tag){
                        filteredTypes.push(type);
                    }
                });
                $scope.home.categoryType=angular.copy(filteredTypes);
            }




        };
        $scope.changeType=function() {
            if ($scope.home.selectedName == 'categoryName') {


                var data = {
                    selectedCategoryType: $scope.home.selectedCategoryType
                };
                $scope.isLoading = true;

                /*$http.post(Api.ecart + '/homePage/categoryType/products', data, {headers: {role: 'admin'}})*/
                CommonFactory.newArrival.postTypes('categoryType',data).then(function (response) {
                    $scope.home.products = response.data;
                    /* _.each(products,function(product){
                     $scope.home.products.push(product);
                     });*/
                    $scope.isLoading = false;

                });
            }
            if($scope.home.selectedName=='brand'){
                var data={
                    selectedBrandType:$scope.home.tag
                }
                /*$http.post(Api.ecart+'/homePage/brands/products',data,{headers:{role:'admin'}})*/
                    CommonFactory.newArrival.postTypes('brands',data).then(function(response){
                    $scope.home.products=response.data;
                    /* _.each(products,function(product){
                     $scope.home.products.push(product);
                     });*/
                    $scope.isLoading=false;

                });
            }

        };
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
                                'url': result
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
                        selected:$scope.home.selectedName,
                        selectedProducts:$scope.home.selectedProducts
                    }
                }else{
                    data = {
                        heading: $scope.home.heading,
                        title: $scope.home.title,
                        offer: $scope.home.offer,
                        tag:$scope.home.tag,
                        images:$scope.home.images,
                        selected:$scope.home.selectedName,
                        selectedProducts:$scope.home.selectedProducts

                    }
                }
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
    })

    .controller('listOrder', function ($scope, toaster,$state, CommonFactory, Api, $http,$timeout, $mdDialog, $q) {
        var arrivals;
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