// put your config code here
// import AngularApollo from 'angular1-apollo'
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from "apollo-link-context";





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
       .constant('APP_ENV',{
           'API_URL':'http://epark.test/api/v1',
           'APP_NAME':'Parkjer'
       })

      .run(function ($rootScope, AUTH_EVENTS, AuthService,$state) {
          $rootScope.$on('$stateChangeStart', function (event, next) {
            var authorizedRoles = angular.isDefined(next.data)? next.data.authorizedRoles: 'guest';
            console.log("route",next)
            if (!AuthService.isAuthenticated()) {
              if(authorizedRoles!='guest'){
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $state.go('access.signin', {});
              }
            }
            else if(!AuthService.isAuthorized(authorizedRoles)){
              event.preventDefault();
              if(next.route.name!='access.signin'){
                alert("You don't have necessary permission")
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              }

            }
          })
      })
      .config((apolloProvider,$authProvider,APP_ENV) => {
        // const client = new ApolloClient({
        //     link: createHttpLink({
        //         uri: "http://localhost:8080/v1/graphql"
        //     }),
        //     cache: new InMemoryCache(),
        // });
        const httpLink = createHttpLink({
          uri: 'http://localhost:8080/v1/graphql',
        });

        const authLink = setContext((_, { headers }) => {
          return {
            headers: {
              ...headers
            }
          }
        });
              // 'x-hasura-admin-secret':'myadminsecretkey'
        $authProvider.baseUrl = APP_ENV.API_URL;
        $authProvider.loginUrl = '/authenticate';
        $authProvider.storageType = 'sessionStorage';
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        });
        
        apolloProvider.defaultClient(client);
    });

})();
