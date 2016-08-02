/**
 * Created by okagour on 21-07-2016.
 */
angular.module('ecart.navigation',[])
.controller('HeaderController',function ($scope, $state,$http,Api) {

        $scope.navigateTo = function (stateName) {
            $state.go(stateName);
        };
        $scope.logOut= function () {
            $http.get(Api.ecart+'/auth/logout')
                .success(function (data, status, headers, config) {
                console.log("Sucesss"+data)
                $state.go('login');

            })
            .error(function (data, status, header, config) {
            })


        }
    });