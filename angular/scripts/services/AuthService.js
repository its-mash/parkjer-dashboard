(function(){
    'use strict';
    angular
        .module('app')
        .factory('AuthService', function ($http, Session,$auth,BACKENDAPI) {
            var authService = {};
            authService.login = function (credentials) {
                return $auth.login(credentials).then(function(res) {
                    console.log(res)
                    // If login is successful, redirect to the users state
                    // $state.go('users', {});
                    // roles=res.data.user.roles.map(role=>{return role.name})
                    Session.create(res.data.user.roles)
                    console.log("rolex",res.data.user.roles)
                    return res.data.user;
                })
                // return $http
                // .post('/login', credentials)
                // .then(function (res) {
                //     Session.create(res.data.id, res.data.user.id,
                //                 res.data.user.role);
                //     return res.data.user;
                // });
            };
            
            authService.isAuthenticated = function () {
                return $auth.isAuthenticated();
            };
            
            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
                }
                var exists=false;
                console.log('session useroles',Session.userRoles)
                Session.userRoles && Session.userRoles.forEach(role=>{
                    exists=exists || authorizedRoles.indexOf(role) !== -1
                })
                console.log("exists",exists)
                return (authService.isAuthenticated() && exists);
            };

            authService.logout=function(){
                $http.get(BACKENDAPI.baseURL+'/logout')
                .then(function(res){
                    // console.log(res.data)
                    $auth.logout()
                })
            }
            return authService;
        })
})();