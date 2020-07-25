(function() {
    'use strict';
    angular
        .module('app')
        .controller('AuthController', AuthController);

        AuthController.$inject = ['$scope','$rootScope','AUTH_EVENTS','AuthService','$state'];

        function AuthController($scope,$rootScope,AUTH_EVENTS,AuthService,$state) {
            var vm = this;
            vm.isProcessing=false;
            vm.login = function() {
                vm.isProcessing=true;
                var credentials = {
                    email: vm.email,
                    password: vm.password
                }

                // Use Satellizer's $auth service to login
                AuthService.login(credentials).then(function() {
                    // console.log("authen suc")
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    // $scope.setCurrentUser(user);
                    // If login is successful, redirect to the users state
                    $state.go('app.dashboard', {});
                }).catch(function (res) {
                    // console.log("authen fai")
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });

            }
            vm.isAuthenticated=AuthService.isAuthenticated

            vm.logout=AuthService.logout
        }
})();