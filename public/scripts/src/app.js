
define([
    'angular',
    'angularRoute',
    'angularAnimate',
    'angularLocalStorage',
    'angularToastr',
    'cryptojslib',
    'controllers',
    'services',
    'filters',
    'angularBootstrap',
    'angularChart',
    'daterangepicker',
    'moment',
    'angulardaterangepicker'

], function (angular) {
    'use strict';

    var mainApp =  angular.module('mainApp', [
        'ngRoute',
        'ngAnimate',
        'LocalStorageModule',
        'toastr',
        'myAppServices',
        'myApp.filters',
        'mainAppControllers',
        'ui.bootstrap',
        'chart.js',
        'daterangepicker'
    ]);


    mainApp.config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);

    mainApp.config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 2000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-full-width',
            preventDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 1000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    });


    mainApp.config(['$routeProvider',
        function($routeProvider) {

            $routeProvider.
                when('/login', {
                    templateUrl: 'partials/login',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm',
                    access: { requiredLogin: false }
                }).
                when('/register', {
                    templateUrl: 'partials/register',
                    controller: 'RegistrationCtrl',
                    controllerAs: 'vm',
                    access: { requiredLogin: false }
                }).
                when('/home', {
                    templateUrl: 'partials/auth/home',
                    controller: 'HomeCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        data : function(Resolver,ResourceService, toastr, $timeout){
                            $timeout(function(){
                                toastr.info('Just moments away!');
                            },1000);
                            return Resolver([ResourceService.getPayruns(true), ResourceService.getPayrunsMeta(true)])
                        }
                    },
                    access: { requiredLogin: true }
                }).
                otherwise({
                    redirectTo: '/login'
                });
        }

    ]);


    mainApp.run(['$rootScope','$location','AuthenticationService',function($rootScope, $location, AuthenticationService) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

            if (nextRoute.access===undefined) {
                $location.path("/login");
            }else if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
                $location.path("/login");
            }else if (AuthenticationService.isLogged() && !nextRoute.access.requiredLogin) {
                $location.path("/home");
            }
        });
    }]);

    return mainApp;


});




