define(['can', 'app/users/authentications', 'app/users/profile'], function (can, Authentications, Profile) {
    'use strict';

    /**
     * Router for users.
     * @author dorajistyle
     * @param {string} target
     * @function Router
     * @name users#Routers
     * @constructor
     */

    var Routers = function (target) {
        new Authentications(target);
        new Profile(target);
    };


    return Routers;
});
