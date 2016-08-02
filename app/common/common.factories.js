/**
 * Created by okagour on 22-07-2016.
 */
angular.module('ecart.common')
    .factory('CommonFactory', function ($http,Api) {
        return {
            category: {

                getAll:function(){
                    return $http.get(Api.ecart+'/category/list');
                        //.success(function (data, status, headers, config) {
                        //    var cookies = headers("Set-Cookie");
                        //    console.log(cookies);
                        //    return data;
                        //});
                },
                get: function (id) {
                    return $http.get(Api.ecart+'/category/' + id);
                },
                post: function (categories) {

                },
                getProducts:function(id){
                     return $http.get(Api.ecart+'/category/' + id + '/product/list');
                },
                getProduct:function(id){
                    return $http.get(Api.ecart+'/product/'+id);
                }
            },
            users:{
               /* admin:function(){
                    return $http.get(Api.ecart+'/auth/login');
                },*/
              getAll:function(){
                  return $http.get(Api.ecart+'')
              }
            }

        };
    });