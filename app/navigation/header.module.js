/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.navigation',[])
.controller('HeaderController',function ($rootScope,toaster,$scope, $state,$http,Api) {

        var data=$rootScope.admin;

        $scope.navigateTo = function (stateName) {
            $state.go(stateName);
        };
        $scope.logOut= function () {
            $http.get(Api.ecart+'/debug');

            $http.post(Api.ecart+'/authenticate/logout',data).then(function (response) {
                if(response.data=='Admin logout'){
                    toaster.pop('success',"","You are Logout Successfully");
                    $state.go('login');
                }

            })

            }



    });