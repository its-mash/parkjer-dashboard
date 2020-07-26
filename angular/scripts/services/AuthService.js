(function(){
    'use strict';
    angular
        .module('app')
        .factory('AuthService', function ($http, Session,$auth, $localStorage,APP_ENV,$state) {
            var authService = {};

            authService.currentUser=null

            var currentUser=APP_ENV.APP_NAME+'-user'

            if ( angular.isDefined($localStorage[currentUser]) ) {
              authService.currentUser = $localStorage[currentUser];
            } else {
              $localStorage[currentUser] = authService.currentUser;
            }

            // console.log("current user",authService.currentUser)

            authService.login = function (credentials) {
                return $auth.login(credentials).then(function(res) {
                    // console.log(res.data)
                    // If login is successful, redirect to the users state
                    // $state.go('users', {});
                    // roles=res.data.user.roles.map(role=>{return role.name})
                    // Session.create(res.data.user.id, res.data.token)
                    // console.log("User",res.data.user)
                    res.data.user.token=res.data.token
                    authService.setCurrentUser(res.data.user)
                    // return res.data.user;
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
                var userRoles =  authService.currentUser!=null ?authService.currentUser.roles :  ['guest']
                // console.log('isAUtho',authorizedRoles)
                // console.log('session useroles',userRoles)
                userRoles.forEach(role=>{
                    exists=exists || authorizedRoles.indexOf(role) !== -1
                })
                // console.log("exists",exists)
                return (authService.isAuthenticated() && exists);
            };

            authService.logout=function(){
                $http.get(APP_ENV.API_URL+'/logout')
                .then(function(res){
                    // console.log(res.data)
                    // Session.destroy()
                    authService.setCurrentUser(null)
                    $auth.logout()
                    $state.go('access.signin', {});
                })
            }
            authService.getCurrentUser=function(){
                return authService.currentUser
            }
            authService.setCurrentUser=function(user){
                $localStorage[currentUser] = user;
                authService.currentUser=user
            }
            return authService;
        })
})();