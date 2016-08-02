/**
 * Created by okagour on 19-07-2016.
 */
angular.module('ecart.categories.product')
.controller('ProductController',function($scope,$http,$state,$stateParams,$mdDialog, Api, CommonFactory,Upload){
       console.log("Product Controller");
        var categoryId=$stateParams.categoryId;
        var productId=$stateParams.id;
        $scope.isLoading = true;


        $scope.productFilter={
            name : ""
        };
        $scope.product = {
            name : "",
            offer : "",
            price : null,
            images : [],
            description : []
        };
        $scope.uploadedImages = [];
        $scope.labels = [];
        $scope.values=[];

        var category;
        CommonFactory.category.get(categoryId)
            .then(function (categoryData) {
                category = categoryData.data;
                $scope.category = category;

                return CommonFactory.category.getProducts(categoryId);
            })/*.then(function(product){
                $scope.product=product.data;
            });*/
       // console.log($scope.product);
            .then(function (allProduct) {
                category.products = allProduct.data;
                _.each(category.products, function (product) {
                    _.each(product.images, function (image) {
                        image.url = Api.ecart + image.url;
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

        $scope.queryGroups = function(search) {
            var filteredProducts =  _.filter($scope.category.products, function (product) {
                return product.name.toLowerCase().indexOf(search) !== -1;
            });
            return filteredProducts;

        };
        $scope.selectedTextChanged= function (searchText) {
            $scope.productFilter.name = searchText;
        };
                //$scope.products = allProduct.data;


        $scope.editProduct=function(id){
             $state.go('ecart.categories.product.edit', {id: id});
        };

        $scope.newProduct=function(categoryId){
            $state.go('ecart.categories.product.new',{categoryId:categoryId});

        };

        $scope.addDescription = function() {
          /*  _.each(product.description, function (desc) {
                $scope.id=desc.id;
            })*/
            var newItemNo = $scope.labels.length+1;
            $scope.product.description.push({label:"",value:""});
          //  $scope.status = JSON.stringify($scope.product.description);


        };

        $scope.removeChoice = function(index) {
            // var lastItem = $scope.labels.length-1;
            $scope.product.description.splice(index,1);
            //$scope.product.description.splice(index,1);
        };


        $scope.uploadImage= function (images) {
            //$scope.categoryImages=images;
            if (images && images.length != 0) {

                angular.forEach(images, function(data, index) {
                    var $reader = new FileReader(), result, $imageElement;

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;
                    };
                    $reader.onloadend = function (e) {
                        var container=angular.element('#image-container');

                        $imageElement = angular.element(document.createElement('img'));
                        // add the source
                        $imageElement.attr('src', result);
                        $imageElement.attr('id',"img-"+index);
                        $imageElement.attr('class',"product_image");

                        // finally add to the container
                        console.log($imageElement);
                        return container.append($imageElement);
                    };

                    // read file
                    $reader.readAsDataURL(data);
                });
                $scope.uploadedImages=images;



                //$scope.product.images = images;
                // $scope.files=images;

                //console.log($scope.product.images);
            //

            }};
        $scope.submit=function(){
            console.log($scope.product.images);
            var images = _.union($scope.product.images,$scope.uploadedImages);
            Upload.upload({
                'content-type' : false,
                url: Api.ecart + '/category/'+categoryId+'/product/update/'+productId,
                data : {
                    'name': $scope.product.name,
                    'offer': $scope.product.offer,
                    images: images,
                    'price':$scope.product.price,
                    'description':$scope.product.description

                }
            })
                .success(function (data, status, headers, config) {
                    console.log(headers("Location"));

                });

        };

        $scope.deleteProduct=function(ev,productId){
            var confirm = $mdDialog.confirm({
                title:'Would you like to delete this item',
                textContent:'',
                ariaLabel:'Lucky day',
                targetEvent:ev,
                ok:'Delete',
                cancel:'Cancel'});
            $mdDialog.show(confirm).then(function() {
            $http.delete(Api.ecart + '/product/' + productId);
            var index = _.findIndex($scope.category.products, {id: productId});
            $scope.category.products.splice(index, 1);
            }, function() {
                console.log('not delete.');
            });

        };





    })

.controller('createProductController',function($scope,$state,$stateParams, Api, CommonFactory,Upload,$mdDialog){

        //var categoryId=$stateParams.categoryId;
        //var productId=$stateParams.id;
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.required=true;


        //$scope.labels = [];
        //$scope.values=[];

        $scope.product = {
            name : "",
            offer : "",
            price : null,
            images : [],
            description : [{
                id: "desc_0",
                label : "",
                value : ""
            }]
        };


        CommonFactory.category.get($stateParams.categoryId)
            .then(function (categoryData) {
                $scope.category = categoryData.data;
            });

        if($scope.mode == 'edit'){
            CommonFactory.category.getProduct($stateParams.id)
                .then(function(productData){
                   $scope.product=productData.data;
                    _.each($scope.product.images, function (image) {
                            image.url = Api.ecart + image.url;

                    });
                    console.log($scope.product.images);
                    console.log($scope.product);

                });
        }



        $scope.uploadImage= function (images) {
            //$scope.categoryImages=images;
            if (images && images.length != 0) {

                angular.forEach(images, function(data, index) {
                    var $reader = new FileReader(), result, $imageElement;

                    // set resulting image
                    $reader.onload = function (e) {
                        result = e.target.result;
                    };
                    $reader.onloadend = function (e) {
                        var container=angular.element('#image-container');

                        $imageElement = angular.element(document.createElement('img'));
                        // add the source
                        $imageElement.attr('src', result);
                        $imageElement.attr('id',"img-"+index);
                        $imageElement.attr('class',"product_image");

                        // finally add to the container
                        console.log($imageElement);
                        return container.append($imageElement);
                    };

                    // read file
                    $reader.readAsDataURL(data);
                });

                $scope.uploadedImages = images;
                $scope.product.images={};
                //console.log($scope.uploadedImages);
            }};

        $scope.submit=function(){
            //var images = _.union($scope.product.images,$scope.uploadedImages);
           // console.log(images);
            var url,methodType,images;
            if($scope.uploadedImages.length>0){
                images=$scope.uploadedImages;
            }
            else{
                images=$scope.category.images;
            }
            if($scope.mode=='edit'){
           //     methodType = 'PUT';
                url= Api.ecart + '/category/'+$stateParams.categoryId+'/product/'+$stateParams.id;

            }
            else if($scope.mode=='create'){
               // methodType = 'POST';
                url= Api.ecart + '/category/'+$stateParams.categoryId+'/product/store';

            }
            Upload
                .upload({
                    'content-type': false,
                    url: url,
                    data: {
                        'name': $scope.product.name,
                        'offer': $scope.product.offer,
                        'price': $scope.product.price,
                        'images':images,
                        'description': $scope.product.description
                    }
                })
                .success(function (data, status, headers, config) {
                    console.log(headers("Location"));
                    $state.go('ecart.categories.product.list', {categoryId: $stateParams.categoryId});

                });
        };

        $scope.addDescription = function() {
            //var newItemNo = $scope.labels.length+1;
            var length = $scope.product.description ? $scope.product.description.length + 1 : 0;
            $scope.product.description.push({
                id: "desc_" + length,
                label : "",
                value : ""
            });
        };

        $scope.removeChoice = function(ev,id) {
           // var lastItem = $scope.labels.length-1;
            var confirm = $mdDialog.confirm({
                title:'Would you like to delete this item?',
                //textContent:'All of the banks have agreed to forgive you your debts.',
                ariaLabel:'Lucky day',
                targetEvent:ev,
                ok:'Delete',
                cancel:'Cancel'});
            $mdDialog.show(confirm).then(function() {
                $scope.product.description.splice(id,1);
            }, function() {
                console.log('not delete');
            });

        };

        $scope.cancel= function () {
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