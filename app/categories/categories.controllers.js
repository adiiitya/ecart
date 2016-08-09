/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.categories')
    .controller('CategoriesController', function ($scope,toaster, $filter, $cookies, $q, $interval, $base64, $mdDialog, Api, $http, $state, CommonFactory) {
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
            _.each(categories, function (category) {
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
              //  console.log(allProducts);
                _.each(categories, function (category) {
                    category.products = _.where(allProducts, {categoryId: (category.id).toString()});
                });
                $scope.categories = categories;
                $scope.isLoading = false;


            });

        $scope.cookieValue = $cookies['Cookie'];

        $scope.queryGroups = function (search) {
            return _.filter($scope.categories, function (category) {
                return category.name.toLowerCase().indexOf(search) !== -1;
            });

        };

        $scope.selectedTextChanged = function (searchText) {
            $scope.categoryFilter.name = searchText;
        };


        $scope.viewCategory = function (category) {
            $state.go('ecart.categories.product.list', {categoryId: category.id});
        };

        $scope.editCategory = function (categoryId) {
            $state.go('ecart.categories.edit', {cId: categoryId});
        };
        $scope.deleteCategory = function (ev, categoryId) {
            var confirm = $mdDialog.confirm({
                title: 'Would you like to delete this item',
                textContent: '',
                ariaLabel: 'Lucky day',
                targetEvent: ev,
                ok: 'Delete',
                cancel: 'Cancel'
            });
            $mdDialog.show(confirm).then(function () {
                CommonFactory.category.delete(categoryId).then(function (response) {
                if(response.data=='category removed'){
                    var index = _.findIndex($scope.categories, {id: categoryId});
                    $scope.categories.splice(index, 1);
                    toaster.pop('success',"","Category Removed Successfully");
                }
                    else {
                    toaster.pop('error',"","You Are Logged Out,Login To delete category ");
                    $state.go('login');
                }
                })

                //$state.go('ecart.categories.all');
            }, function () {
                console.log('not delete.');
            });
        };


    })


    .controller('CreateCategoriesController', function ($scope,toaster, $stateParams, $base64, $state, $http, CommonFactory, Api, $cookies, $cookieStore, Upload) {
        var categoryId = $stateParams.cId;
        $scope.mode = $stateParams.mode;
        $scope.uploadedImages = [];
        $scope.cancelDiv = false;
        var cookieValue;
        var imgg = [];

        var category;
        if (categoryId) {
            CommonFactory.category.get(categoryId).then(function (categoriesData) {
                category = categoriesData.data;
                _.each(category.images, function (image) {
                    image.url = Api.image + image.url;
                });
                $scope.category = category;
            });
        }

        $scope.showTitle = function () {
            $scope.complete = true;
        };

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

                        // console.log($imageElement);
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
                $scope.uploadedImages = (images);


            }
        };

var data={};
        $scope.submit = function () {
            var images;
            if ($scope.uploadedImages.length > 0) {
                images = imgg;
                data = {
                    'name': $scope.category.name,
                    'offer': $scope.category.offer,
                    'images': images
                };

            }
            else {
                data = {
                    'name': $scope.category.name,
                    'offer': $scope.category.offer
                };

            }
 //var images = _.union($scope.category.images,$scope.uploadedImages);

            if ($scope.mode == 'create') {
                if($scope.uploadedImages.length ==0)
                {
                    toaster.pop('error',"","Select atleast one image file")
                }else{
                CommonFactory.category.save(data).then(function (response) {
                    console.log("Sucesss"+response )
                    if(response.data=='category created')
                    {
                        toaster.pop('success', "", response.data+'Successfully');
                        $state.go('ecart.categories.all');

                    }
                    else{
                        toaster.pop('error', "",'You are Logged Out, Login To Create Category');
                        $state.go('login');
                    }
                })
            }
            }
            if ($scope.mode == 'edit') {
                CommonFactory.category.update(categoryId, data).then(function (response) {
                    console.log(imgg) ;
                    console.log("Sucesss"+response )
                    if(response.data=='category created')
                    {
                        toaster.pop('success', "", 'Category Updated successfully');
                        $state.go('ecart.categories.all');

                    }
                    else{
                        toaster.pop('error', "",'You are Logged Out, Login To Update Category');
                        $state.go('login');
                    }

                })

            }
  };
        $scope.cancel = function () {
            /* $scope.category.name="";
             $scope.category.offer="";
             $scope.uploadedImages = [];
             $scope.cancelDiv=true;*/

        }


    })