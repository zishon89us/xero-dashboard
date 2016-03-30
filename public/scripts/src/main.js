require.config({
    baseUrl: '../scripts',
    paths :{
        'app' : 'src/app',
        'controllers' : 'src/controllers',
        'services' : 'src/services',
        'filters' : 'src/filters',
        'angular' :'lib/angular/angular.min',
        'angularRoute' : 'lib/angular-route/angular-route.min',
        'angularLocalStorage' : 'lib/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate' : 'lib/angular-animate/angular-animate.min',
        'angularToastr': 'lib/angular-toastr/dist/angular-toastr.tpls.min',
        'cryptojslib' : 'lib/cryptojslib/rollups/pbkdf2',
        'jquery' : 'lib/jquery/dist/jquery.min',
        'bootstrap' : 'lib/bootstrap/dist/js/bootstrap.min',
        'angularBootstrap' : 'lib/angular-bootstrap/ui-bootstrap-tpls.min',
        'angularChart' : 'lib/angular-chart.js/dist/angular-chart.min',
        'chart' : 'lib/Chart.js/Chart.min',
        'moment' : 'lib/moment/moment',
        'daterangepicker' : 'lib/bootstrap-daterangepicker/daterangepicker',
        'angulardaterangepicker' : 'lib/angular-daterangepicker/js/angular-daterangepicker.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute' :{
            deps: ['angular'],
            exports : 'angularRoute'
        },
        'angularAnimate' :{
            deps: ['angular'],
            exports : 'angularAnimate'
        },
        'angularLocalStorage' :{
            deps: ['angular'],
            exports : 'angularLocalStorage'
        },
        'cryptojslib' : {
            exports : 'cryptojslib'
        },
        'angularToastr': {
            deps: ['angularAnimate'],
            exports: 'angularToastr'
        },
        'bootstrap' : ['jquery'],
        'angularBootstrap': {
            deps: ['angular'],
            exports: 'angularBootstrap'
        },
        'chart' : {
            deps: [],
            exports: 'chart'
        },
        'angularChart': {
            deps: ['angular'],
            exports: 'angularChart'
        },
        'moment': {
            exports: 'moment'
        },
        'daterangepicker': {
            deps: ['angular'],
            exports: 'daterangepicker'
        },
        'angulardaterangepicker': {
            deps: ['angular'],
            exports: 'angulardaterangepicker'
        }
    }
});


require(['require','angular','bootstrap','app'], function () {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['mainApp']);
    });
});