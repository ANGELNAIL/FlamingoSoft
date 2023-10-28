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
    $rootScope.ShowPass=async function(Pass)
    {
        var contrasenia='';
        await 
        $http({
            url: "https://localhost:7039/Api/Usuarios/Desencriptar",
            method: "get",
            params:{Pass:Pass}
        }).then( async function (response) {
            contrasenia=await response.data;

        }).catch(function (err) {
            console.error("Error al desencriptar contraseña:", err.data);
        });
        return contrasenia;
    }
    $rootScope.sortBy = function (ColumnName) {
        $rootScope.reverse = ($rootScope.ColumnName === ColumnName) ? !$rootScope.reverse : false;
        $rootScope.ColumnName = ColumnName;
    };
    $rootScope.FormatoInput=function(Fecha)
    {
        console.log(Fecha);
        const timestamp = parseInt(Fecha.substr(6));
        const date = new Date(timestamp);
        console.log(date);
        return date;
    }
    $rootScope.FormatearFechaNet=function(Fecha)
    {
        console.log(Fecha);
        const tiempoEnMilisegundos = Fecha.getTime();
        const fechaJSONFormatoNet = `/Date(${tiempoEnMilisegundos})`;
        console.log(fechaJSONFormatoNet);
        return fechaJSONFormatoNet;
    }
    $rootScope.Closmod = function (modclos, modopen) {
        $(modclos).modal('hide');
        $(modopen).modal('show');
    }
}]);

FlamingoSoft.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Vistas/Home.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        }).when('/Empleados', {
            templateUrl: '/Vistas/Empleados/Empleados.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        })
        .when('/Clientes', {
            templateUrl: '/Vistas/Clientes/Clientes.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        })
        .otherwise({
            templateUrl: '<h1>Otherwise</h1>'// This is when any route not matched => error
        });}]);

FlamingoSoft.filter('Fecha', ['$filter', function ($filter) {
    return function (date, format, timezone) {
        return date && $filter('date')(date.slice(6, -2), format, timezone);
    };
}]);