var FlamingoSoft = angular.module('FlamingoSoftApp', ['ngRoute','ngFileUpload','ngCookies', 'angularUtils.directives.dirPagination']);

FlamingoSoft.run(['$rootScope', '$http','$cookies',async function ($rootScope,$http,$cookies,Upload) {
    $rootScope.decodedToken=null;
    $rootScope.RegistrosXPag = '10';   
    $rootScope.PalabraClave = '';
    $rootScope.ContRegistros = 0;
    $rootScope.showPassword = false;
    $rootScope.Hoy = new Date();
    $rootScope.Anio = new Date().getFullYear();
    $rootScope.Mes = new Date().getMonth();
    $rootScope.FechaIni = new Date($rootScope.Anio, $rootScope.Mes, 1);
    $rootScope.FechaFin = new Date($rootScope.Anio, $rootScope.Mes + 1, 0);
    $rootScope.FileUpload = function (File)
    {
        Upload.base64DataUrl(File).then(function (url) 
        {
            // La variable 'url' contendrá la representación Base64 de la imagen.
            console.log(url);
            return url;
        });
    }      
    $rootScope.getCookie = async function () {
        let session = await $cookies.getObject('user');
        if(session !=null)
        {
            $rootScope.decodedToken=session[0];
        }else
        {
            $rootScope.Logout();
        }
    }
    $rootScope.Logout = function () {
        $rootScope.decodedToken = null;
        $rootScope.delCookie('user');
        $rootScope.title = null;
        $rootScope.Token = null;
        window.location.assign("../Login.html");
    }
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
//---------------------------------
    $rootScope.delCookie = function (key) {
        $cookies.remove(key);
    }
    $rootScope.LeerToken = function (token) {
        $rootScope.decodedToken=JSON.parse(atob(token.split('.')[1]));        
                return JSON.parse(atob(token.split('.')[1]));
    }
    //security
    $rootScope.ExpiredToken = async function (token) {
        let decodedToken = JSON.parse(atob(token.split('.')[1]));
        let exp = await $rootScope.ParseDateUnix(decodedToken.exp);
        let now = new Date(Date.now());
        let Diference = await $rootScope.DateDiference(exp, now);
        return Diference;
    }
    $rootScope.ParseDateUnix = function (Fecha) {
        return new Date(Fecha * 1000);
    }
    $rootScope.DateDiference = function (Date1, Date2) {
        let Diferenciaminutos = (Date1 - Date2) / 60000;
        return Diferenciaminutos;
    }

}]);

FlamingoSoft.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Vistas/Home.html', // Asegúrate de que esta ruta sea válida
            controller: 'TareaController'
        }).when('/Empleados', {
            templateUrl: '/Vistas/Empleados/Empleados.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        })
        .when('/Clientes', {
            templateUrl: '/Vistas/Clientes/Clientes.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        }).when('/CarteraClientes', {
            templateUrl: '/Vistas/CarteraClientes/CarteraClientes.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        }).when('/Actividades', {
            templateUrl: '/Vistas/Actividades/Actividades.html', // Asegúrate de que esta ruta sea válida
            controller: 'ClienteController'
        }).when('/Tareas', {
            templateUrl: '/Vistas/Tareas/Tareas.html', // Asegúrate de que esta ruta sea válida
            controller: 'TareaController'
        })
        .otherwise({
            templateUrl: '<h1>Otherwise</h1>'// This is when any route not matched => error
        });}]);

FlamingoSoft.filter('Fecha', ['$filter', function ($filter) {
    return function (date, format, timezone) {
        return date && $filter('date')(date.slice(6, -2), format, timezone);
    };
}]);