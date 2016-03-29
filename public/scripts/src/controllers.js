define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', []);
    mainAppControllers.controller('NavCtrl', ['$location', 'localStorageService', 'AuthenticationService', NavCtrl]);
    mainAppControllers.controller('LoginCtrl', ['$location', 'ResourceService' ,'CryptoJSService', 'localStorageService', 'toastr' ,LoginCtrl]);
    mainAppControllers.controller('RegistrationCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'toastr', RegistrationCtrl]);
    mainAppControllers.controller('HomeCtrl', ['ResourceService', 'data', 'toastr', '$uibModal', HomeCtrl]);
    mainAppControllers.controller('ProvaCtrl', [ProvaCtrl]);

    function ProvaCtrl() {
        var vm = this;
        vm.user = "";
    }

    ProvaCtrl.prototype.printHello = function()
    {
        var vm = this;
        return "Hello World "+vm.user;
    };


    function NavCtrl($location, localStorageService, AuthenticationService)
    {
        var vm = this;
        vm.$location = $location;
        vm.localStorageService = localStorageService;
        vm.isAuthenticated = AuthenticationService.isLogged()
    }

    NavCtrl.prototype.logout = function ()
    {
        var vm = this;
        vm.localStorageService.clearAll();
        vm.$location.path("/login");
    };



    function LoginCtrl ($location, ResourceService, CryptoJS, localStorageService, toastr, datepicker)
    {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.localStorageService = localStorageService;
        vm.toastr = toastr;

        vm.failed_login = "";
    }

    LoginCtrl.prototype.submit = function()
    {
        var vm = this;
        var salt = vm.username;
        var enc_password = CryptoJS.PBKDF2(vm.password, salt, { keySize: 256/32 });

        var user = {"username": vm.username, "password": enc_password.toString(), "remember": vm.remember ? true : false};

        if(vm.username!==undefined || vm.password !==undefined){

            vm.ResourceService.login(user).then(function(data){
                vm.localStorageService.set("auth_token",data.auth_token);
                vm.$location.path("/home");
            },function(data, status) {
                if(status===401){
                    vm.toastr.error('Wrong username and/or password!');
                }else{
                    vm.toastr.error(data);
                }
            });

        }else{
            noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'error'});
        }
    };

    function RegistrationCtrl ($location, ResourceService, CryptoJS, toastr)
    {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.toastr = toastr;
    }

    RegistrationCtrl.prototype.signup = function()
    {
        var vm = this;
        var salt = vm.username;

        var enc_password = CryptoJS.PBKDF2(vm.password, salt, { keySize: 256/32 });
        var enc_check_password = CryptoJS.PBKDF2(vm.check_password, salt, { keySize: 256/32 });

        var user = {"username": vm.username, "password": enc_password.toString(), "check_password" : enc_check_password.toString() };

        if(vm.username!==undefined || vm.password !==undefined || vm.check_password !==undefined){
            if(vm.password !== vm.check_password){
                vm.toastr.warning('password and check_password must be the same!');
            }else{
                vm.ResourceService.signup(user).then(function(data){
                    vm.toastr.success('Account created, Please Login now.');
                    vm.username = null;
                    vm.password = null;
                    vm.check_password = null;

                    //take user to login page
                    vm.$location.path("/login");

                },function(data) {
                    vm.toastr.error(data.message);
                });
            }
        }else{
            noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'warning'});
        }
    };


    function HomeCtrl(ResourceService, data, toastr, $uibModal)
    {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.data = data;
        vm.toastr = toastr;

        vm.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        vm.chartData = [300, 500, 100];

        vm.showinfo = function(person){
            $uibModal.open({
                animation: true,
                templateUrl: 'partials/detail.modal.html',
                controller: function(){
                    this.person = person
                },
                controllerAs: 'vm'
            });
        };
                /*        vm.people = data[0].people;
                        vm.things = data[1].things;*/
    }


    return mainAppControllers;

});