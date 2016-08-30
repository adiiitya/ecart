/**
 * Created by okagour on 22-07-2016.
 */
angular.module('ecart.common')
    .factory('CommonFactory', function ($http, Api,$mdDialog) {
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
                delete: function (categoryId) {
                    return $http.delete(Api.ecart + '/category/' + categoryId, {headers: {role: 'admin'}})
                },
                products: {
                    all: function () {
                        return $http.get(Api.ecart + '/product/list');
                    },
                    get: function (id) {
                        return $http.get(Api.ecart + '/product/' + id);
                    },
                    getTypes:function(){
                      return $http.get(Api.ecart + '/category/types');
                    },
                    getGender:function(){
                      return  $http.get(Api.ecart + '/product/gender');
                    },
                    save: function (id, data) {
                        return $http.post(Api.ecart + '/product', data, {headers: {role: 'admin'}});
                    },
                    update: function (id, pid, data) {

                        return $http.put(Api.ecart + '/product/' + pid, data, {headers: {role: 'admin'}});
                    },
                    delete: function (id) {
                        return $http.delete(Api.ecart + '/product/' + id, {headers: {role: 'admin'}});
                    }
                }
            },
            users: {
                /* admin:function(){
                 return $http.get(Api.ecart+'/auth/login');
                 },*/
                getAll: function () {
                    return $http.get(Api.ecart + '/authenticate/user', {headers: {role: 'admin'}})
                },
                sentMail: function (data) {
                    return $http.post(Api.ecart + '/user/sentEmail', {emailData: data}, {headers: {role: 'admin'}})
                }
            },
            newArrival: {
                getTypes: function (itemName) {
                  return  $http.get(Api.ecart+'/homePage/search/'+itemName);
                },
                postTypes:function(type,data){
                  return $http.post(Api.ecart + '/homePage/'+type+'/products', data, {headers: {role: 'admin'}})
                },
                save: function (data) {
                    return $http.post(Api.ecart + '/homePage', data, {headers: {role: 'admin'}})
                },
                update: function (id, data) {
                    return $http.put(Api.ecart + '/newArrival/' + id, data, {headers: {role: 'admin'}})
                },
                delete: function (id) {
                    return $http.delete(Api.ecart + '/newArrival' + id, {headers: {role: 'admin'}});
                }
            },
            dialogBox:{
                openDialog: function (ev) {
                    var config = {
                        title: 'Would you like to delete this item?',
                        ariaLabel: 'Remove',
                        targetEvent: ev,
                        ok: 'Delete',
                        cancel: 'Cancel'
                    };
                    var confirm = $mdDialog.confirm(config);
                    return $mdDialog.show(confirm);
                },
                openErrorDialog: function (ev) {
                    var config = $mdDialog.confirm({
                        title: 'You have to add atleast one item',
                        ariaLabel: 'Remove',
                        targetEvent: ev,
                        ok: 'Ok'
                    });
                    return $mdDialog.show(config);
                }
            }

        };
    });