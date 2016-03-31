define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', []);
    mainAppControllers.controller('NavCtrl', ['$location', 'localStorageService', 'AuthenticationService', NavCtrl]);
    mainAppControllers.controller('LoginCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'localStorageService', 'toastr', LoginCtrl]);
    mainAppControllers.controller('RegistrationCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'toastr', RegistrationCtrl]);
    mainAppControllers.controller('HomeCtrl', ['$scope', '$timeout', 'ResourceService', 'data', 'toastr', '$uibModal', HomeCtrl]);
    mainAppControllers.controller('ProvaCtrl', [ProvaCtrl]);

    function ProvaCtrl() {
        var vm = this;
        vm.user = "";
    }

    ProvaCtrl.prototype.printHello = function () {
        var vm = this;
        return "Hello World " + vm.user;
    };


    function NavCtrl($location, localStorageService, AuthenticationService) {
        var vm = this;
        vm.$location = $location;
        vm.localStorageService = localStorageService;
        vm.isAuthenticated = AuthenticationService.isLogged()
    }

    NavCtrl.prototype.logout = function () {
        var vm = this;
        vm.localStorageService.clearAll();
        vm.$location.path("/login");
    };


    function LoginCtrl($location, ResourceService, CryptoJS, localStorageService, toastr, datepicker) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.localStorageService = localStorageService;
        vm.toastr = toastr;

        vm.failed_login = "";
    }

    LoginCtrl.prototype.submit = function () {
        var vm = this;
        var salt = vm.username;
        var enc_password = CryptoJS.PBKDF2(vm.password, salt, {keySize: 256 / 32});

        var user = {
            "username": vm.username,
            "password": enc_password.toString(),
            "remember": vm.remember ? true : false
        };

        if (vm.username !== undefined || vm.password !== undefined) {

            vm.ResourceService.login(user).then(function (data) {
                vm.localStorageService.set("auth_token", data.auth_token);
                vm.$location.path("/home");
            }, function (data, status) {
                if (status === 401) {
                    vm.toastr.error('Wrong username and/or password!');
                } else {
                    vm.toastr.error(data);
                }
            });

        } else {
            noty({text: 'Username and password are mandatory!', timeout: 2000, type: 'error'});
        }
    };

    function RegistrationCtrl($location, ResourceService, CryptoJS, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.toastr = toastr;
    }

    RegistrationCtrl.prototype.signup = function () {
        var vm = this;
        var salt = vm.username;

        var enc_password = CryptoJS.PBKDF2(vm.password, salt, {keySize: 256 / 32});
        var enc_check_password = CryptoJS.PBKDF2(vm.check_password, salt, {keySize: 256 / 32});

        var user = {
            "username": vm.username,
            "password": enc_password.toString(),
            "check_password": enc_check_password.toString()
        };

        if (vm.username !== undefined || vm.password !== undefined || vm.check_password !== undefined) {
            if (vm.password !== vm.check_password) {
                vm.toastr.warning('password and check_password must be the same!');
            } else {
                vm.ResourceService.signup(user).then(function (data) {
                    vm.toastr.success('Account created, Please Login now.');
                    vm.username = null;
                    vm.password = null;
                    vm.check_password = null;

                    //take user to login page
                    vm.$location.path("/login");

                }, function (data) {
                    vm.toastr.error(data.message);
                });
            }
        } else {
            noty({text: 'Username and password are mandatory!', timeout: 2000, type: 'warning'});
        }
    };


    function HomeCtrl($scope, $timeout, ResourceService, data, toastr, $uibModal) {
        var vm = this;
        vm.ResourceService = ResourceService;
        if (typeof data[0].payrun == "string")
            vm.toastr.info("No Payrun Found :| Try Refreshing.");
        /*if(typeof data[0].previousPayrun == "string")
         vm.toastr.info("No Previous Payrun Available for Selected Range :|");*/
        if (typeof data[0].previousPayrun == "string")
            vm.toastr.info("No Employees Found :| Try Refreshing.");

        vm.PKRExhangeRate = 1;
        vm.ResourceService.getPKRExchangeRate(true).then(function (data) {
            vm.PKRExhangeRate = data.PKR;
        }, function (data, status) {
            vm.toastr.error("Exchange Rate for PKR Failed.");
        });

        vm.payrun = data[0].payrun;
        vm.previousPayrun = data[0].previousPayrun;
        vm.employees = data[0].employees;

        vm.netPayArr = [];
        vm.deductionsArr = [];
        vm.earningsArr = [];
        vm.monthsArr = [];

        //check if array is returned
        if (data[1].Response.PayRuns && data[1].Response.PayRuns.PayRun) {
            if (typeof data[1].Response.PayRuns.PayRun.map == "function") {
                var tempPayRuns = data[1].Response.PayRuns.PayRun;
                for (var i in tempPayRuns) {
                    vm.netPayArr.push(tempPayRuns[i].NetPay);
                    vm.deductionsArr.push(tempPayRuns[i].Deductions);
                    vm.earningsArr.push(tempPayRuns[i].Earnings);
                    vm.monthsArr.push(moment(tempPayRuns[i].PayRunPeriodEndDate).format("MMM"));
                }
            }
            //check if object is returned
            if (typeof data[1].Response.PayRuns.PayRun == "object" && typeof data[1].Response.PayRuns.PayRun.map == "undefined") {
                tempPayRuns = data[1].Response.PayRuns.PayRun;
                vm.netPayArr.push(tempPayRuns.NetPay);
                vm.deductionsArr.push(tempPayRuns.Deductions);
                vm.earningsArr.push(tempPayRuns.Earnings);
                vm.monthsArr.push(moment(tempPayRuns.PayRunPeriodEndDate).format("MMM"));
            }

        }

        vm.toastr = toastr;

        vm.date = {
            startDate: moment().subtract(1, 'months').startOf('month'),
            endDate: moment().subtract(1, 'months').endOf('month')
        };

        //Watch for date changes
        vm.init = true;
        $scope.$watch('vm.date', function (newDate) {

            if (!vm.init) {
                vm.toastr.info("On the way! Fetching data...");
                vm.ResourceService.getPayrunsWithDate({
                    startDate: newDate.startDate.format('YYYY-MM-DD'),
                    endDate: newDate.endDate.format('YYYY-MM-DD')
                }, true).then(function (data) {
                    if (typeof data.payrun == "string")
                        vm.toastr.error("No Payrun Found for Selected Range :|");
                    if (typeof data.previousPayrun == "string")
                        vm.toastr.error("No Previous Payrun Available for Selected Range :|");

                    vm.payrun = data.payrun;
                    vm.previousPayrun = data.previousPayrun;
                    vm.employees = data.employees;
                }, function (data, status) {
                    vm.toastr.error(data);
                });
            }
            else
                vm.init = false;


        }, false);

        //pie chart
        vm.labels = ["FULLTIME", "PARTTIME", "WAGES"];
        vm.chartData = [0, 0, 0];
        var pieObj = {
            "FULLTIME": 0, "PARTTIME": 0, "WAGES": 0
        };
        for (var i in vm.employees) {
            pieObj[vm.employees[i].EmploymentBasis] += Number(1);
        }
        if (Object.keys(pieObj).length) {
            vm.labels = [];
            vm.chartData = [];
            for (var key in pieObj) {
                vm.labels.push(key);
                vm.chartData.push(pieObj[key]);
            }
        }
        vm.series = [
            "Full Time",
            "Part Time",
            "Visiting"
        ];

        vm.config = {legend: {display: true, position: 'right'}};

        //line chart
        vm.NetPayOverTimeLabels = vm.monthsArr || ["Jan", "Feb", "Mar", "April"];
        $scope.series = ['Series A', 'Series B'];
        vm.NetPayOverTimeData = [
            vm.netPayArr,
            vm.deductionsArr
        ];

        vm.showEmployeeDetail = function (employeeId, paystub) {
            $uibModal.open({
                animation: true,
                templateUrl: 'partials/detail.modal.html',
                controller: function () {
                    this.employee = vm.employees[employeeId],
                    this.paystub = paystub,
                    this.PKRExhangeRate = vm.PKRExhangeRate
                },
                controllerAs: 'vm'
            });
        };

    }


    return mainAppControllers;

});