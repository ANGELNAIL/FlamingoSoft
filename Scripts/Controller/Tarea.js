(function (Tarea) {
    "use strict";
    Tarea.controller("TareaController", function ($http,$rootScope, $scope) {
        $scope.ListTareasMod = null;
        $scope.Estado='A';
        $scope.Consultas=null;
        $scope.ListTareasAsignadas = null;
        $scope.NewTareas=
        {
            idTarea: 0,
            usrCreador:String($rootScope.decodedToken.idUsuario),
            usrEncargado:0,
            fechaSolicitud:$rootScope.FechaIni,
            fechaEntrega:$rootScope.FechaFin,
            comentarios:'',
            idActividad:0,
            idCliente:0,
            estatus: 'A'
        }
        $scope.Tareas_Ins = function (NewTareas) {
            $http({
                url: "https://localhost:7039/Api/Tareas/PostTarea",
                method: "POST",
                data:NewTareas
            }).then(function (response) {
                 var creador=$scope.AsignarNombreEmpleado(response.data.usrCreador);
                 var encargado=$scope.AsignarNombreEmpleado(response.data.usrEncargado);   
                 var actividad=$scope.AsignarNombreActividad(response.data.idActividad);
                 var cliente=$scope.CarteraClientes_SelbyUser(response.data.idCliente);
                 $scope.ListTareasMod.push({    
                        idTarea:response.data.idTarea,
                        creador:creador,
                        encargado:encargado, 
                        fechaSolicitud:response.data.fechaSolicitud,
                        fechaEntrega:response.data.fechaEntrega,
                        actividad:actividad,
                        estatus: response.data.estatus              
                });
                $rootScope.ContRegistros = $scope.ListTareasMod.length;
                $rootScope.Closmod('#NuevoTareas','');
                alert('Se ha registrado con exito');
            }).catch(function (err) {
                console.error("Error al crear Tareas:", err.data);
                alert("Error al crear Tareas:", err.data);
            });
        }
        $scope .Tareas_Sel =function (Estado) {    
            $http({
                url: "https://localhost:7039/Api/Tareas",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                console.log(response.data);
                $scope.ListTareasMod = response.data;              
                $rootScope.ContRegistros=response.data.length;
            }).catch(function (err) {
                console.log(err.data);
                alert('Excepcion Sel.' + err.data);

            });
        }    
        $scope .Tareas_Asignadas =function () {    
            $http({
                url: "https://localhost:7039/Api/Tareas/GetTareasasignadas",
                method: "get"
            }).then(function (response) {
                console.log(response.data);
                $scope.ListTareasAsignadas = response.data;     
                $rootScope.ContRegistros=response.data.length;     
            }).catch(function (err) {
                console.log(err.data);
                alert('Excepcion Sel.' + err.data);

            });
        }    
        $scope .Tareas_Consultas =function (Estado) {    
            $http({
                url: "https://localhost:7039/Api/Tareas/GetTareasConsultas",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                console.log(response.data);
                $scope.Consultas = response.data;             
            }).catch(function (err) {
                console.log(err.data);
                alert('Excepcion consultas.' + err.data);

            });
        }    
        $scope .Tareas_SelbyId =function (Id) {
            $http({
               url: "https://localhost:7039/Api/Tareas/GetTarea",
               method: "get",
               params:{id:Id}
           }).then(function (response) {
            console.log(response.data);
                $scope.Edit = response.data;
                $scope.Edit.usrCreador=String($scope.Edit.usrCreador);
                $scope.Edit.usrEncargado=String($scope.Edit.usrEncargado);
                $scope.Edit.idActividad=String($scope.Edit.idActividad);
                $scope.Edit.fechaEntrega=new Date($scope.Edit.fechaEntrega);
                $scope.Edit.fechaSolicitud=new Date($scope.Edit.fechaSolicitud);
           }).catch(function (err) {
               alert('Excepcion SelById.' + err.data);
           });
       }
        $scope.Tareas_LoadEdit = function (e) {
            //EditTareas
            e.estatus='A';
            $scope.Edit= e;  
        };
        $scope.Tareas_Upd = function (EditTareas) {
            var i;
            for (i = 0; i < $scope.ListTareasMod.length; i++) {
                if ($scope.ListTareasMod[i].idTarea === EditTareas.idTarea) {
                    $http({
                        url: "https://localhost:7039/api/Tareas/PutTarea",
                        method: "put",
                        data: EditTareas
                    }).then(function (response) {
                        console.log(response.data);                       
                        var creador=$scope.AsignarNombreEmpleado(parseInt(EditTareas.usrCreador));
                        var encargado=$scope.AsignarNombreEmpleado(parseInt(EditTareas.usrEncargado));
                        var actividad=$scope.AsignarNombreActividad(parseInt(EditTareas.idActividad));
                        $scope.ListTareasMod[i].creador=creador;
                        $scope.ListTareasMod[i].encargado=encargado;   
                        $scope.ListTareasMod[i].actividad=actividad;   
                        $scope.ListTareasMod[i].fechaEntrega=EditTareas.fechaEntrega;   
                        $scope.ListTareasMod[i].fechaSolicitud=EditTareas.fechaSolicitud;         
                        $scope.ListTareasMod[i].estatus=$scope.Estado;       
                        $rootScope.Closmod('#DetallesTareas','');
                        $scope.Editar=false;
                        alert(response.data);
                    }).catch(function (err) {
                        alert('Excepcion Upd.' + err.data);
                    });
                    break;
                }
            }
        };
        $scope.Tareas_Del = function (Id) {           
             var i;
            for (i = 0; i < $scope.ListTareasMod.length; i++) {
                if ($scope.ListTareasMod[i].idTarea === Id) {
                    $http({
                        url: "https://localhost:7039/Api/Tareas/DeleteTarea",
                        method: "DELETE",
                        params: { id: Id }
                    }).then(function (response) {
                        if ($scope.Estado === 'A') {
                            $scope.ListTareasMod.splice(i, 1);
                            $rootScope.ContRegistros = $scope.ListTareasMod.length;
                        } else {
                            $scope.ListTareasMod[i].estatus = 'C';
                        }
                        $rootScope.Closmod('#EliminarTareas','');                        
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
        $scope.AsignarNombreEmpleado=function (ID) {
            var i;
            for(i=0;$scope.Consultas.empleados.length;i++)
            {
                if($scope.Consultas.empleados[i].idUsuario===ID)
                {
                    console.log($scope.Consultas.empleados[i].empleado);
                    return $scope.Consultas.empleados[i].empleado;
                }
            }
        }
        $scope.AsignarNombreActividad=function (ID) {
            var i;
            for(i=0;$scope.Consultas.actividades.length;i++)
            {
                if($scope.Consultas.actividades[i].idActividad===ID)
                {
                    console.log($scope.Consultas.actividades[i].actividad);
                    return $scope.Consultas.actividades[i].actividad;
                }
            }
        }     
        $scope.AsignarNombreCliente=function (ID) {
            var i;
            for(i=0;$scope.ListCarteraClientesUsr.length;i++)
            {
                if($scope.ListCarteraClientesUsr[i].idCliente===ID)
                {
                    console.log($scope.ListCarteraClientesUsr[i].cliente);
                    return $scope.ListCarteraClientesUsr[i].cliente;
                }
            }
        }     
        $scope.CarteraClientes_SelbyUser =function (Id) {
            $http({
               url: "https://localhost:7039/Api/CarteraClientes/GetCarteraCliente_SelById",
               method: "get",
               params:{id:Id}
           }).then(function (response) {
            console.log(response.data);
                $scope.ListCarteraClientesUsr = response.data;
                $scope.contCliente=response.data.length;
                console.log(response.data);
           }).catch(function (err) {
               alert('Excepcion SelById.' + err.data);
           });
       }     
    });})(FlamingoSoft);