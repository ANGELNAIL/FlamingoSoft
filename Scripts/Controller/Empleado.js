(function (Empleado) {
    "use strict";
    Empleado.controller("EmpleadoController", function ($http,$rootScope, $scope,Upload) {
        $scope.ListEmpleadoMod = null;
        $scope.Estado='A';
        $scope.Editar=false;
       $scope.NewEmpleado=
        {
            idEmpleado:0,
            nombre:'',
            apellidoPaterno:'',
            apellidoMaterno:'',
            cargo:'Contador',    
            fechaNac:new Date($rootScope.Anio, $rootScope.Mes, 1),
            imagen:'',
            idusuario:0,
            usuario:
            {
                idusuario:0,
                nombre:'',
                correo:'',
                contrasenia:'',
                rol:'Admin',
                estatus:'A'
            }
        }
        $scope.Cargo=
        [
            {Puesto:"Contador"},
            {Puesto:"Auxiliar"},
            {Puesto:"Pasante"},
        ]
        $scope.Empleado_Ins = function (NewEmpleado) {
            //NewEmpleado.imagen= atob(NewEmpleado.imagen.split(',')[1]);
            $http({
                url: "https://localhost:7039/Api/Empleados/PostEmpleado",
                method: "POST",
                data: NewEmpleado
            }).then(async function (response) {
                $scope.NewEmpleado.usuario.nombre=response.data.usuario.nombre;
                $scope.NewEmpleado.usuario.contrasenia=await $rootScope.ShowPass(response.data.usuario.contrasenia);
                //$rootScope.Closmod('#NuevoEmpleado','');                
                $scope.ListEmpleadoMod.push({    
                    idEmpleado: response.data.idEmpleado,
                    nombre: response.data.nombre,
                    apellidoPaterno: response.data.apellidoPaterno,
                    apellidoMaterno: response.data.apellidoMaterno,
                    cargo:response.data.cargo,
                    fechaNac:response.data.fechaNac,
                    imagen:response.data,
                    idusuario:response.data.idusuario
                });
                //$rootScope.Closmod('','#NuevoEmpleado');
                $rootScope.ContRegistros = $scope.ListEmpleadoMod.length;
                alert('Se ha registrado con exito');
            }).catch(function (err) {
                console.error("Error al crear Empleado:", err.data);
            });
        }
        $scope .Empleado_Sel =function (Estado) {            
             $http({
                url: "https://localhost:7039/Api/Empleados",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                console.log(response.data)
                $scope.ListEmpleadoMod = response.data;              
                $rootScope.ContRegistros = response.data.length;
            }).catch(function (err) {
                alert('Excepcion Sel.' + err.data);
            });
        }
        $scope .Empleado_SelbyId =function (Id) {
            $http({
               url: "https://localhost:7039/Api/Empleados/GetEmpleado",
               method: "get",
               params:{Id:Id}
            }).then(async function (response) {
            console.log(response.data);       
            response.data.fechaNac =new Date(response.data.fechaNac);
            $scope.Edit = response.data;
            $scope.Edit.usuario.contrasenia=await $rootScope.ShowPass($scope.Edit.usuario.contrasenia);
           }).catch(function (err) {
            console.log(err);
               alert('Excepcion SelById.' + err.data);
           });
       }
       $scope.fileChanged = function () {
        var fileInput = document.getElementById('fileInput');
        var file = fileInput.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.base64Data = e.target.result;
                $scope.$apply(); // Asegúrate de aplicar los cambios al ámbito de Angular
            };
            $scope.NewEmpleado.imagen=reader.readAsDataURL(file);
            console.log($scope.NewEmpleado.imagen);
        }
    };
        $scope.Empleado_LoadEdit = function (e) {
            $scope.Edit= e;  
        };
        $scope.Empleado_Upd = function (EditEmpleado) {
            var i;
            for (i = 0; i < $scope.ListEmpleadoMod.length; i++) {
                if ($scope.ListEmpleadoMod[i].IdEmpleado === EditEmpleado.IdEmpleado) {
                    $http({
                        url: "https://localhost:7039/api/Empleados/PutEmpleado",
                        method: "put",
                        data: EditEmpleado
                    }).then(function (response) {
                        $scope.ListEmpleadoMod[i].idEmpleado=EditEmpleado.idEmpleado;
                        $scope.ListEmpleadoMod[i].nombre=EditEmpleado.nombre;
                        $scope.ListEmpleadoMod[i].apellidoPaterno=EditEmpleado.apellidoPaterno;
                        $scope.ListEmpleadoMod[i].apellidoMaterno=EditEmpleado.apellidoMaterno;                        $scope.ListEmpleadoMod[i].apellidoMaterno=EditEmpleado.apellidoMaterno;
                        $scope.ListEmpleadoMod[i].rol=EditEmpleado.rol;
                        $scope.ListEmpleadoMod[i].fechaNac=EditEmpleado.fechaNac;
                        $rootScope.Closmod('#DetallesEmpleado','');
                        alert(response.data);
                    }).catch(function (err) {
                        alert('Excepcion Upd.' + err.data);
                    });
                    break;
                }
            }
        };
        $scope.Empleado_Del = function (Id) {            var i;
            for (i = 0; i < $scope.ListEmpleadoMod.length; i++) {
                if ($scope.ListEmpleadoMod[i].idEmpleado === Id) {
                    $http({
                        url: "https://localhost:7039/Api/Empleados",
                        method: "DELETE",
                        params: { id: Id }
                    }).then(function (response) {
                        if ($scope.Estado === 'A') {
                            $scope.ListEmpleadoMod.splice(i, 1);
                            $rootScope.ContRegistros = $scope.ListEmpleadoMod.length;
                        } else {
                            $scope.ListEmpleadoMod[i].estatus = 'C';
                        }
                        $rootScope.Closmod('#EliminarEmpleado','');                        
                        alert(response.data);        
                    }).catch(function (err) {
                        console.log(err);
                        alert('Excepcion Al Eliminar.' + err.data);
                    });
                    break;
                }
            }
        };  
        $scope.CargarImagen=function (File) {
            /*
            Upload.base64DataUrl(File).then(function (url) 
            {
                // La variable 'url' contendrá la representación Base64 de la imagen.
                console.log(url);
                $scope.NewEmpleado.imagen= url;
            });*/
        }
    });})(FlamingoSoft);