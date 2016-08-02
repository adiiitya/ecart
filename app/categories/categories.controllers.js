/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.categories')
    .controller('CategoriesController', function ($scope,$filter,$cookies, $q,$interval,$base64,$mdDialog, Api, $http, $state, CommonFactory) {
        var categories;
        var self = this;
        $scope.isLoading = true;
        $scope.categoryFilter={
            name : ""
        };
        self.activated = true;
        self.determinateValue = 30;
        //$interval(function() {
        //    self.determinateValue += 1;
        //    if (self.determinateValue > 100) {
        //        self.determinateValue = 30;
        //    }
        //}, 100);


        CommonFactory.category.getAll().then(function (categoriesData) {
            categories = angular.copy(categoriesData.data);
            console.log("cookieee"+categoriesData.headers('Set-Cookie'));

            // console.log(categoriesData.headers());
            var defer = $q.defer();
            var promises = [];
            _.each(categories, function (category) {
                promises.push(CommonFactory.category.getProducts(category.id).then(function (productPromise) {
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
                console.log(allProducts);
                _.each(categories, function (category) {
                    category.products = _.where(allProducts, {categoryId: (category.id).toString()});
                });
                $scope.categories = categories;
                $scope.isLoading = false;


            });

        $scope.cookieValue = $cookies['Cookie'];
console.log("Recieved cookie="+$scope.cookieValue);


        $scope.queryGroups = function(search) {
            return  _.filter($scope.categories, function (category) {
                return category.name.toLowerCase().indexOf(search) !== -1;
            });

        };

        $scope.selectedTextChanged= function (searchText) {
            $scope.categoryFilter.name = searchText;
        };





        $scope.viewCategory = function (category) {
            $state.go('ecart.categories.product.list', {categoryId: category.id});
        };

        $scope.editCategory = function (categoryId) {
            $state.go('ecart.categories.edit', {cId: categoryId});
        };
        $scope.deleteCategory = function (ev,categoryId) {
            var confirm = $mdDialog.confirm({
                title:'Would you like to delete this item',
                textContent:'',
                ariaLabel:'Lucky day',
                targetEvent:ev,
                ok:'Delete',
                cancel:'Cancel'});
            $mdDialog.show(confirm).then(function() {
                $http.delete(Api.ecart + '/category/' + categoryId);
                var index = _.findIndex($scope.categories, {id: categoryId});
                $scope.categories.splice(index, 1);
                //$state.go('ecart.categories.all');
            }, function() {
                console.log('not delete.');
            });
        };


    })


    .controller('CreateCategoriesController', function ($scope, $stateParams,$base64, $state, $http, CommonFactory, Api,$cookies, $cookieStore, Upload) {
        var categoryId = $stateParams.cId;
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.cancelDiv=false;
        var cookieValue;
        var imgg=[];

        var category;
        if (categoryId) {
            CommonFactory.category.get(categoryId).then(function (categoriesData) {
                category = categoriesData.data;
                //_.each(category, function (category) {
                _.each(category.images, function (image) {
                    image.url = Api.ecart + image.url;
                });
                //});
                $scope.category = category;


                console.log(category);

            });
        }

        $scope.showTitle=function(){
        $scope.complete=true;
        };

        $scope.uploadImage= function (images) {
            //$scope.categoryImages=images;
            //$scope.cancelDiv=false;
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
                        //if($scope.cancelDiv==true) {
                        //    $imageElement.html("");
                        //    $scope.cancelDiv=false;
                        //}

                        console.log($imageElement);
                        // add the source
                        $imageElement.attr('src', result);
                        //$scope.imgg=(result);
                        $imageElement.attr('id',"img-"+index);
                        $imageElement.attr('class',"product_image");

                        // finally add to the container
                        console.log($imageElement);
                        return container.append($imageElement);
                    };

                    // read file
                    $reader.readAsDataURL(data);
                });
                $scope.uploadedImages = (images);

               //$scope.category.images={};



                //$scope.product.images = images;
                // $scope.files=images;

                //console.log($scope.product.images);
                //

            }};

        //$scope.cookieValue = $cookies['Cookie'];
        console.log($scope.cookieValue);

        $scope.submit = function () {
            var url,methodType,images;
            if($scope.uploadedImages.length>0){
              // images=$scope.imgg;
                images=($scope.uploadedImages);
            }
            else{
                images=($scope.category.images);
            }
            //var images = _.union($scope.category.images,$scope.uploadedImages);

            if ($scope.mode == 'create') {
                methodType = 'POST';
                url = Api.ecart + '/category/store';
            }
            if ($scope.mode == 'edit') {
               methodType = 'PUT';
                url = Api.ecart + '/category/' + categoryId;

            }
//$cookies.Cookie='XDEBUG_SESSION=18826';
            console.log($scope.cookieValue);
           // $cookieStore.put("Set-Cookie", cookieValue);
           // $cookieStore.put("XDEBUG_SESSION", 11563);
/*var data= {
    'name': $scope.category.name,
    'offer': $scope.category.offer,
    'images': images
};
var headers=  {
                "Content-Type": "application/json"
            };
            $http.put(url, data,headers)
                .success(function (data, status, headers, config) {
                    console.log("Sucesss"+data)
                })
                .error(function (data, status, header, config) {
                })*/

            //var request = $http({
            //    method: "put",
            //    url: url,
            //    data: data,
            //    headers: {'Content-Type': 'application/json'}
            //})
            Upload
                .upload({
                    method:methodType,
                    'content-type': false,
                    //'cookie': 'XDEBUG_SESSION=16966',
                    url: url,
                    data: {
                        'name': $scope.category.name,
                        'offer': $scope.category.offer,
                        'images': images
                    }
                })
               .success(function (data, status, headers, config) {
                    if($scope.mode=='create') {
                        $state.go('ecart.categories.all');
                        console.log(headers['Location']);
                    }
                    console.log(headers['Location']);

                });

        };
        $scope.cancel= function () {
           /* $scope.category.name="";
            $scope.category.offer="";
            $scope.uploadedImages = [];
            $scope.cancelDiv=true;*/

        }


    })