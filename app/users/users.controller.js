/**
 * Created by okagour on 29-07-2016.
 */
angular.module('ecart.users')
    .controller('UsersController', function ($scope, $http, Api, CommonFactory, $mdDialog, toaster) {
        $scope.isLoading = true;
        $scope.sendingMail = false;
        $scope.email = [];
        $scope.row = {
            selected : undefined
        };



        CommonFactory.users.getAll().then(function (userData) {
            $scope.users = userData.data;
            _.each($scope.users, function (user) {
                user.selected = false;
            });

            $scope.isLoading = false;
        });
        $scope.addMail=function(rowIndex){
            $scope.users[rowIndex].selected = $scope.row.selected[rowIndex];

        };

        $scope.addAllMail= function () {
            if($scope.checkAll){
            _.each($scope.users, function (user) {
                user.id
                $scope.row.selected=true;
                //$scope.email.push(user.email);
            });
                $scope.users.selected=$scope.row.selected;
            //$scope.check=true;
            }else{
                $scope.row.selected=false;

            }
        };


        console.log($scope.email);
        $http.get(Api.ecart + '/debug');

        $scope.sendMail = function (ev, email) {
            $scope.sendingMail = true;


            //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'dialogcontroller',
                templateUrl: 'users/userDialogMail.html',
                //parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    email: email
                }
                //fullscreen: useFullScreen
            })
                .then(function (answer) {
                    //var url = Api.ecart + '/user/sentEmail';
                    $http.get(Api.ecart + '/debug');

                    var data = {
                        email: email,
                        adminMessage: answer.adminMessage,
                        subject: answer.subject
                    };
                    CommonFactory.users.sentMail(data).then(function (response) {
                            console.log(response.data);
                            $scope.sendingMail = false;
                            toaster.pop("success", "", data/*"Message sent successfully"*/);
                        })


                }, function () {

                });

        };
        $scope.sendMailAll = function (ev) {
//            $scope.sendingMail = true;
            var email=[];
            _.each($scope.users, function (user) {
                if(user.selected==true)
                email.push(user.email);
            })
console.log(email);
            $http.get(Api.ecart + '/debug');

            //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'dialogcontroller',
                templateUrl: 'users/userDialogMail.html',
                //parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    email: email
                }
                //fullscreen: useFullScreen
            })
                .then(function (answer) {
                    //var url = Api.ecart + '/user/sentEmail';
                    var emailobj={};
                    var emailData = [];
                    _.each(email, function (userEmail) {
                        emailData.push({
                            email: userEmail,
                            adminMessage: answer.adminMessage,
                            subject: answer.subject
                        });
                    });
                    emailobj=(emailData);
                    CommonFactory.users.sentMail(emailobj).then(function (response) {
                        console.log(response.data);
  //                      $scope.sendingMail = false;
                        toaster.pop("success", "", emailData/*"Message sent successfully"*/);
                    },function(err){

                    })


                }, function (err) {

                });


            /* $scope.$watch(function() {
             return $mdMedia('xs') || $mdMedia('sm');
             }, function(wantsFullScreen) {
             $scope.customFullscreen = (wantsFullScreen === true);
             });*/
        };



    })

    .controller('dialogcontroller', function ($scope, $mdDialog, toaster, email) {
        $scope.email = email;
        $scope.user = {
            subject: "",
            message: ""
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            $scope.sendingMail=false;
            $scope.isLoading=false;
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    })
