var app = angular.module("Login", ['ngCookies'])
    .controller("LoginController", function ($scope, $http,$cookies) {
        $scope.Entrada = null; 
        $scope.Contra = null; 
        $scope.Login = function (Entrada, Contra) {
            $http({
                url: "https://localhost:7039/api/Usuarios/Login",
                method: "get",
                params: {
                    Pass: Contra, email: Entrada
                }
            }).then(function (response) {
                $cookies.putObject('user', response.data);
                window.location.assign("../");
            }).catch(function (err) {
                alert('Excepcion Login.' + err.data);
            });
        }
    });