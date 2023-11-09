(function (Actividad) {
    "use strict";
    Actividad.controller("ActividadesController", function ($http,$rootScope, $scope) {
        $scope.ListActividadesMod = null;
        $scope.NewActividades=
        {
            idActividad: 0,
            nombre:'',
            descripcion:'',
            estatus: 'A'
        }
        $scope.Actividades_Ins = function (NewActividades) {
            $http({
                url: "https://localhost:7039/Api/Actividades/PostActividad",
                method: "POST",
                data:NewActividades
            }).then(function (response) {
                    $scope.ListActividadesMod.push({    
                        idCidActividadliente:response.data.idActividad,
                        nombre: NewActividades.nombre,
                        descripcion: NewActividades.descripcion,
                        estatus: NewActividades.estatus               
                });
                $rootScope.ContRegistros = $scope.ListActividadesMod.length;
                $rootScope.Closmod('#NuevoActividades','');
                alert('Se ha registrado con exito');
            }).catch(function (err) {
                alert("Error al crear Actividades:", err.data);
                console.error("Error al crear Actividades:", err.data);
            });
        }
        $scope .Actividades_Sel =function (Estado) {    
            $http({
                url: "https://localhost:7039/Api/Actividades",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                console.log(response.data);
                $scope.ListActividadesMod = response.data;              
                $rootScope.ContRegistros=response.data.length;
            }).catch(function (err) {
                console.log(err.data);
                alert('Excepcion Sel.' + err.data);

            });
        }    
        $scope .Actividades_SelbyId =function (Id) {
            $http({
               url: "https://localhost:7039/Api/Actividades/GetActividad",
               method: "get",
               params:{id:Id}
           }).then(function (response) {
            console.log(response.data);
                $scope.Edit = response.data;
                $scope.Edit.idCliente=String($scope.Edit.idCliente);
                $scope.Edit.idUsuario=String($scope.Edit.idUsuario);
           }).catch(function (err) {
               alert('Excepcion SelById.' + err.data);
           });
       }
        $scope.Actividades_LoadEdit = function (e) {
            //EditActividades
            e.estatus='A';
            $scope.Edit= e;  
        };
        $scope.Actividades_Upd = function (EditActividades) {
            var i;
            for (i = 0; i < $scope.ListActividadesMod.length; i++) {
                if ($scope.ListActividadesMod[i].idActividad === EditActividades.idActividad) {
                    $http({
                        url: "https://localhost:7039/api/Actividades/PutActividad",
                        method: "put",
                        data: EditActividades
                    }).then(function (response) {
                        switch($scope.Estado)
                        {
                            case 'C':
                                $scope.ListActividadesMod.splice(i, 1);
                                $rootScope.ContRegistros = $scope.ListActividadesMod.length;
                                break;
                            default:
                                $scope.ListActividadesMod[i].descripcion=EditActividades.descripcion;
                                $scope.ListActividadesMod[i].nombre=EditActividades.nombre;
                                $scope.ListActividadesMod[i].estatus=EditActividades.estatus;            
                                break;
                        }
                        $rootScope.Closmod('#DetallesActividades','');
                        $scope.Editar=false;
                        alert(response.data);
                    }).catch(function (err) {
                        alert('Excepcion Upd.' + err.data);
                    });
                    break;
                }
            }
        };
        $scope.Actividades_Del = function (Id) {           
             var i;
            for (i = 0; i < $scope.ListActividadesMod.length; i++) {
                if ($scope.ListActividadesMod[i].idActividad === Id) {
                    $http({
                        url: "https://localhost:7039/Api/Actividades/DeleteActividad",
                        method: "DELETE",
                        params: { id: Id }
                    }).then(function (response) {
                        if ($scope.Estado === 'A') {
                            $scope.ListActividadesMod.splice(i, 1);
                            $rootScope.ContRegistros = $scope.ListActividadesMod.length;
                        } else {
                            $scope.ListActividadesMod[i].estatus = 'C';
                        }
                        $rootScope.Closmod('#EliminarActividades','');                        
                        alert(response.data);        
                    }).catch(function (err) {
                        console.log(err);
                        alert('Excepcion Al Eliminar.' + err.data);
                    });
                    break;
                }
            }
        };    
        $scope.ValidarEditar=function () 
        {
            if($scope.Editar===true)
            {
                $scope.Editar=false;
            }
        }    
    });})(FlamingoSoft);