var FlamingoSoft = angular.module('FlamingoSoftApp', ['ngRoute', 'angularUtils.directives.dirPagination']);

FlamingoSoft.run(['$rootScope', '$http', function ($rootScope, $http) {
    $rootScope.RegistrosXPag = '25';
    $rootScope.PalabraClave = '';
    $rootScope.ContRegistros = 0;
    $rootScope.showPassword = false;
    $rootScope.Hoy = new Date();
    $rootScope.Anio = new Date().getFullYear();
    $rootScope.Mes = new Date().getMonth();
    $rootScope.FechaIni = new Date($rootScope.Anio, $rootScope.Mes, 1);
    $rootScope.FechaFin = new Date($rootScope.Anio, $rootScope.Mes + 1, 0);
    $rootScope.sortBy = function (ColumnName) {
        $rootScope.reverse = ($rootScope.ColumnName === ColumnName) ? !$rootScope.reverse : false;
        $rootScope.ColumnName = ColumnName;
    };
}]);

FlamingoSoft.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Vistas/Clientes/Cliente.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        })
        .when('/palabraclave', {
            templateUrl: '../Controller/Vista', // Asegúrate de que esta ruta sea válida
            controller: 'MainController'
        }).
        otherwise({
            templateUrl: '<h1>Otherwise</h1>'// This is when any route not matched => error
        });}]);

FlamingoSoft.filter('Fecha', ['$filter', function ($filter) {
    return function (date, format, timezone) {
        return date && $filter('date')(date.slice(6, -2), format, timezone);
    };
}]);