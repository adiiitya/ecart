/**
 * Created by okagour on 22-07-2016.
 */
angular.module('ecart.common')
    .factory('CommonFactory', function ($http, Api) {
        return {
            category: {

                getAll: function () {
                    return $http.get(Api.ecart + '/category/list');
                },
                get: function (id) {
                    return $http.get(Api.ecart + '/category/' + id);
                },
                save: function (data) {
                    return $http.post(Api.ecart + '/category', data, {headers: {role: 'admin'}});
                },
                update: function (id, data) {

                    return $http.put(Api.ecart + '/category/' + id, data, {headers: {role: 'admin'}});
                },
                delete:function(categoryId){
                        return $http.delete(Api.ecart + '/category/' + categoryId,{headers:{role:'admin'}})
                },
                products: {
                    all: function (id) {
                        return $http.get(Api.ecart + '/category/' + id + '/product/list');
                    },
                    get: function (id) {
                        return $http.get(Api.ecart + '/product/' + id);
                    },
                    save: function (id, data) {
                        return $http.post(Api.ecart + '/category/' + id + '/product', data, {headers: {role: 'admin'}});
                    },
                    update: function (id, pid, data) {

                        return $http.put(Api.ecart + '/category/' + id + '/product/' + pid, data, {headers: {role: 'admin'}});
                    },
                    delete:function(id){
                        return $http.delete(Api.ecart + '/product/' + id, {headers: {role: 'admin'}});
                    }
                }
            },
            users: {
                /* admin:function(){
                 return $http.get(Api.ecart+'/auth/login');
                 },*/
                getAll: function () {
                    return $http.get(Api.ecart + '')
                }
            }

        };
    });