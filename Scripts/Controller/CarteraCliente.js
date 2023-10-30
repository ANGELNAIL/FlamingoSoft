(function (Cliente) {
    "use strict";
    Cliente.controller("CarteraClientesController", function ($http,$rootScope, $scope) {
        $scope.ListCarteraClientesMod = null;
        $scope.Estado='A';
        $scope.Consultas=null;
        $scope.NewCarteraClientes=
        {
            idCartera: 0,
            estatus: 'A',
            idCliente:0,
            idUsuario:0
        }
        $scope.CarteraClientes_Ins = function (NewCarteraClientes) {
            $http({
                url: "https://localhost:7039/Api/CarteraClientes/PostCarteraCliente",
                method: "POST",
                data:NewCarteraClientes
            }).then(function (response) {
                console.log(response.data);
                var i,nombre;
                for (i = 0; i < $scope.Consultas.cliente.length; i++) {
                     console.log(i);
                     if($scope.Consultas.cliente[i].idCliente===parseInt(NewCarteraClientes.idCliente))
                     {
                        console.log($scope.Consultas.cliente[i]);
                        nombre=$scope.Consultas.cliente[i].cliente;
                     }
                }

                    $scope.ListCarteraClientesMod.push({    
                    idCartera: response.data.idCartera,
                    cliente: nombre,
                    estatus: NewCarteraClientes.estatus,               
                    idCliente:NewCarteraClientes.idCliente,
                });
                $rootScope.ContRegistros = $scope.ListCarteraClientesMod.length;
                $rootScope.Closmod('#NuevoCarteraClientes','');
                alert('Se ha registrado con exito');
            }).catch(function (err) {
                alert("Error al crear CarteraClientes:", err.data);
                console.error("Error al crear CarteraClientes:", err.data);
            });
        }
        $scope .CarteraClientes_Sel =function (Estado) {    
            $http({
                url: "https://localhost:7039/Api/CarteraClientes",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                console.log(response.data);
                $scope.ListCarteraClientesMod = response.data;              
                $rootScope.ContRegistros=response.data.length;
            }).catch(function (err) {
                console.log(err.data);
                alert('Excepcion Sel.' + err.data);

            });
        }
        $scope.CarteraClienteConsultas_Sel =function () {    
            $http({
                url: "https://localhost:7039/Api/CarteraClientes/GetCarteraClienteConsultas",
                method: "get"
            }).then(function (response) {
                $scope.Consultas=response.data;
            }).catch(function (err) {
                alert('Excepcion Sel Consultas.' + err.data);
            });
        }
        $scope .CarteraClientes_SelbyId =function (Id) {
            $http({
               url: "https://localhost:7039/Api/CarteraClientes/GetCarteraCliente",
               method: "get",
               params:{id:Id}
           }).then(function (response) {
            console.log(response);
                $scope.Edit = response.data;
                $scope.Edit.idCliente=String($scope.Edit.idCliente);
                $scope.Edit.idUsuario=String($scope.Edit.idUsuario);
           }).catch(function (err) {
               alert('Excepcion SelById.' + err.data);
           });
       }
        $scope.CarteraClientes_LoadEdit = function (e) {
            //EditCarteraClientes
            $scope.EditCarteraClientes= e;  
        };
        $scope.CarteraClientes_Upd = function (EditCarteraClientes) {
            var i;
            for (i = 0; i < $scope.ListCarteraClientesMod.length; i++) {
                if ($scope.ListCarteraClientesMod[i].IdCliente === EditCliente.IdCliente) {
                    $http({
                        url: "https://localhost:7039/api/CarteraClientes/PutCarteraClientes",
                        method: "put",
                        data: EditCarteraClientes
                    }).then(function (response) {
                        $scope.ListCarteraClientesMod[i].idCliente=EditCarteraClientes.idCliente;
                        $scope.ListCarteraClientesMod[i].nombreComercial=EditCarteraClientes.nombreComercial;
                        $scope.ListCarteraClientesMod[i].nombre=EditCarteraClientes.nombre;
                        $scope.ListCarteraClientesMod[i].apellidoPaterno=EditCarteraClientes.apellidoPaterno;
                        $scope.ListCarteraClientesMod[i].apellidoMaterno=EditCarteraClientes.apellidoMaterno;
                        $scope.ListCarteraClientesMod[i].correo=EditCarteraClientes.correo;
                        $scope.ListCarteraClientesMod[i].telefono=EditCarteraClientes.telefono;
                        $scope.ListCarteraClientesMod[i].celular=EditCarteraClientes.celular;
                        $scope.ListCarteraClientesMod[i].direccion=EditCarteraClientes.direccion;
                        $scope.ListCarteraClientesMod[i].persona=EditCarteraClientes.persona;
                        $scope.ListCarteraClientesMod[i].estatus=EditCarteraClientes.estatus;      
                        $rootScope.Closmod('#DetallesCarteraClientes','');
                        $scope.Editar=false;
                        alert(response.data);
                    }).catch(function (err) {
                        alert('Excepcion Upd.' + err.data);
                    });
                    break;
                }
            }
        };
        $scope.CarteraClientes_Del = function (Id) {           
             var i;
            for (i = 0; i < $scope.ListCarteraClientesMod.length; i++) {
                if ($scope.ListCarteraClientesMod[i].idCliente === Id) {
                    $http({
                        url: "https://localhost:7039/Api/CarteraClientes",
                        method: "DELETE",
                        params: { id: Id }
                    }).then(function (response) {
                        if ($scope.Estado === 'A') {
                            $scope.ListCarteraClientesMod.splice(i, 1);
                            $rootScope.ContRegistros = $scope.ListCarteraClientesMod.length;
                        } else {
                            $scope.ListCarteraClientesMod[i].estatus = 'C';
                        }
                        $rootScope.Closmod('#EliminarCarteraClientes','');                        
                        alert(response.data);        
                    }).catch(function (err) {
                        console.log(err);
                        alert('Excepcion Al Eliminar.' + err.data);
                    });
                    break;
                }
            }
        };        
    });})(FlamingoSoft);