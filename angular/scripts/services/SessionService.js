(function(){
    'use strict';
    angular
        .module('app')
        .service('Session', function () {
            this.create = function (userRoles) {
                this.userRoles = userRoles;
            };
            this.destroy = function () {
                this.userRoles = [];

            };
        })
})();