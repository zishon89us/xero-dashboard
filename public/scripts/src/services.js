define(['angular'], function (angular) {
    'use strict';

    var myAppServices = angular.module('myAppServices', []);
    myAppServices.service('Resolver',['$q', Resolver]);
    myAppServices.service('ResourceService',['$q', '$http', ResourceService]);
    myAppServices.service('TokenInterceptor',['$q','$location','localStorageService', TokenInterceptor]);
    myAppServices.service('CryptoJSService',[CryptoJSService]);
    myAppServices.service('AuthenticationService',['localStorageService', AuthenticationService]);


    function Resolver($q)
    {
        return function(promises){
            return $q.all(promises);
        }
    }

    function ResourceService($q,$http)
    {

        var _promises = {};

        var _genericCallback = function(key, data){
            _promises[key] = data;
        };

        var _promisesGetter = function(method, URL, data, key, refresh){
            if(!refresh && _promises[key]!== undefined){
                return $q.when(_promises[key]);
            }else{
                return _ajaxRequest(method, URL, data, key);
            }
        };

        var _ajaxRequest = function(method, URL, data, key){
            var deferred = $q.defer();
            if(method === "GET"){
                $http({method: method, url: URL, params:data}).
                    success(function(data) {
                        deferred.resolve(data);
                        if(URL==="GET") _genericCallback(key,data);
                    }).
                    error(function(data) {
                        deferred.reject(data);
                    }
                );
            }
            else{
                $http({method: method, url: URL, data:data}).
                    success(function(data) {
                        deferred.resolve(data);
                        if(URL==="GET") _genericCallback(key,data);
                    }).
                    error(function(data) {
                        deferred.reject(data);
                    }
                );
            }
            return deferred.promise;
        };

        return {
            getPayruns : function(refresh){
                return _promisesGetter('GET','/api/payruns/employees/range', null, "payruns", refresh);
            },
            getPayrunsWithDate : function(data, refresh){
                return _promisesGetter('GET','/api/payruns/employees/range', data, "payruns", refresh);
            },
            getPayrunsMeta : function(data, refresh){
                return _promisesGetter('GET','/api/payruns', null, "payrunsMeta", refresh);
            },
            getPayrunsMeta : function(refresh){
                return _promisesGetter('GET','/api/payruns', null, "payrunsMeta", refresh);
            },
            getPKRExchangeRate : function(refresh){
                return _promisesGetter('GET','/api/exchange/usd/pkr', null, "pkr", refresh);
            },
            signup : function(user){
                return _ajaxRequest('POST', '/api/signup', user, null);
            },
            login : function(user){
                return _ajaxRequest('POST', '/api/login', user, null);
            }


        }
    }

    function TokenInterceptor($q, $location, localStorageService)
    {
        return {
            request: function (config) {
                config.headers = config.headers || {};

                if(localStorageService.get("auth_token")!==null)
                    config.headers.Authorization = 'Bearer '+localStorageService.get("auth_token");

                return config;
            },

            response: function (response) {                
                return response || $q.when(response);
            },
            responseError : function (response) {

                if(response.config.url!=="/api/login" && response.status===401){
                    localStorageService.clearAll();
                    $location.path("/login");                    
                }

                return $q.reject(response);

            }
        };
    }


    function CryptoJSService(){
        return CryptoJS;
    }

    function AuthenticationService(localStorageService){
        return {
            isLogged: function()
            {
                var authenticated = false;
                if(localStorageService.get("auth_token")!==null)
                    authenticated = true;

                return authenticated;
            }
        }
    }

    return myAppServices;
});