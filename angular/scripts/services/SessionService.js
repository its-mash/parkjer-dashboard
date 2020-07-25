(function(){
    'use strict';
    angular
        .module('app')
        .service('Session', function () {
            this.create = function (userId,token) {
                this.token = token;
                this.userId=userId;
                console.log("Ses tok",token)
            };
            this.destroy = function () {
                this.token = null;
                this.userId= null;
            };
        })
})();