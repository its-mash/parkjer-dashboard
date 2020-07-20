/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

import AngularApollo from 'angular1-apollo'

(function() {
    'use strict';
    angular
      .module('app', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'ngStore',
        'ui.router',
        'ui.utils',
        'ui.load',
        'ui.jp',
        'oc.lazyLoad',
        'angular-apollo',
        'satellizer'
      ]);
})();
