// put your config code here
// import AngularApollo from 'angular1-apollo'
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from "apollo-link-context";


const httpLink = createHttpLink({
  uri: 'http://localhost:8080/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret':'myadminsecretkey'
    }
  }
});



(function(){
    'use strict';

    angular.module('app')
       .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
       })
       .constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            viewer: 'viewer',
            guest: 'guest'
       })
       .constant('BACKENDAPI',{
           'baseURL':'http://epark.test/api/v1'
       })

      .run(function ($rootScope, AUTH_EVENTS, AuthService,$state) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
          var authorizedRoles = next.data.authorizedRoles;
          if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
              // user is not allowed
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              $state.go('access.signin', {});
              console.log("authRoles",authorizedRoles)
            } else {
              // user is not logged in
              alert("You don't have necessary permission")

              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
          }
        });
      })
      .config((apolloProvider,$authProvider,BACKENDAPI) => {
        // const client = new ApolloClient({
        //     link: createHttpLink({
        //         uri: "http://localhost:8080/v1/graphql"
        //     }),
        //     cache: new InMemoryCache(),
        // });

        $authProvider.baseUrl = BACKENDAPI.baseURL;
        $authProvider.loginUrl = '/authenticate';
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        });
        
        apolloProvider.defaultClient(client);
    });
    // .config(function ($httpProvider) {
    //   $httpProvider.interceptors.push([
    //     '$injector',
    //     function ($injector) {
    //       return $injector.get('AuthInterceptor');
    //     }
    //   ]);
    // })
    // .factory('AuthInterceptor', function ($rootScope, $q,
    //                                       AUTH_EVENTS) {
    //   return {
    //     responseError: function (response) { 
    //       $rootScope.$broadcast({
    //         401: AUTH_EVENTS.notAuthenticated,
    //         403: AUTH_EVENTS.notAuthorized,
    //         419: AUTH_EVENTS.sessionTimeout,
    //         440: AUTH_EVENTS.sessionTimeout
    //       }[response.status], response);
    //       return $q.reject(response);
    //     }
    //   };
    // });

})();
