// put your config code here
// import AngularApollo from 'angular1-apollo'
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

(function(){
    'use strict';

    angular.module('app').config((apolloProvider) => {
        const client = new ApolloClient({
            link: createHttpLink({
                uri: "http://localhost:8080/v1/graphql"
            }),
            cache: new InMemoryCache(),
        });
        
        apolloProvider.defaultClient(client);
    });

})();
