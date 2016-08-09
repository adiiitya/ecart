/**
 * Created by okagour on 03-08-2016.
 */
angular.module('ecart.common')
.factory('CommonLog',function($mdToast){
        return{
            logs:{
                    Toast:function(msg){
                        $mdToast.show({
                            //controller:'LoginController',
                            template: '<md-toast><span flex>'+msg+'</span></md-toast>',
                            hideDelay: 3000,
                            position: 'bottom right'
                        });

                    }
            }
        }
    })