'use strict';

/* Filters */
angular.module('myApp.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).
    filter('num', function () {
        return function (input) {
            return parseInt(input, 10);
        };
    }).
    filter('keylength', function () {
        return function (input) {
            if (typeof input != "object") {
                throw Error("Usage of non-objects with keylength filter!!")
            }
            return Object.keys(input).length;
        }
    });
