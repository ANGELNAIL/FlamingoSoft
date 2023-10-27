(function (Cliente) {
    "use strict";
    Cliente.controller("ClienteController", function ($http,$rootScope, $scope) {
        $scope.ListClienteMod = null;
        $scope.Estado='';
        $scope.ContRegistros = '0';
        $scope.Palabraclave = '';
        $scope.RegistrosXPag = '25';
        $scope.regimenFiscal= [
            { clave: "601", nombre: "General de Ley Personas Morales" },
            { clave: "603", nombre: "Personas Morales con Fines no Lucrativos" },
            { clave: "605", nombre: "Sueldos y Salarios e Ingresos Asimilados a Salarios" },
            { clave: "606", nombre: "Arrendamiento" },
            { clave: "607", nombre: "Régimen de Enajenación o Adquisición de Bienes" },
            { clave: "608", nombre: "Demás ingresos" },
            { clave: "609", nombre: "Consolidación" },
            { clave: "610", nombre: "Residentes en el Extranjero sin Establecimiento Permanente en México" },
            { clave: "611", nombre: "Ingresos por Dividendos (socios y accionistas)" },
            { clave: "612", nombre: "Personas Físicas con Actividades Empresariales y Profesionales" },
            { clave: "614", nombre: "Ingresos por intereses" },
            { clave: "615", nombre: "Régimen de los ingresos por obtención de premios" },
            { clave: "616", nombre: "Sin obligaciones fiscales" },
            { clave: "620", nombre: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
            { clave: "621", nombre: "Incorporación Fiscal" },
            { clave: "622", nombre: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
            { clave: "623", nombre: "Opcional para Grupos de Sociedades" },
            { clave: "624", nombre: "Coordinados" },
            { clave: "625", nombre: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
            { clave: "626", nombre: "Régimen Simplificado de Confianza" },
            { clave: "628", nombre: "Hidrocarburos" },
            { clave: "629", nombre: "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales" },
            { clave: "630", nombre: "Enajenación de acciones en bolsa de valores" }
          ];                  
       $scope.NewCliente=
        {
            idCliente: 0,
            nombreComercial: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            correo: '',
            telefono: '',
            celular: '',
            direccion: '',
            persona: '1',
            estatus: 'A',
            informacionFiscal: {
             idInformacionFiscal: 0,
              rfc: 'XAXX010101000',
              inicioActividades: new Date($rootScope.Anio, $rootScope.Mes, 1),
              regimenFiscal: '',
              cp: '',
              idCliente: 0
            }
          }
        $scope.Cliente_Ins = function (NewCliente) {
            $http({
                url: "https://localhost:7039/Api/Clientes/PostCliente",
                method: "post",
                data:{'cliente':NewCliente},
        headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
        }}).then(function (response) {
                $scope.ListClienteMod.push({    
                    idCliente: response.data.idCliente,
                    nombreComercial: response.data.nombreComercial,
                    nombre: response.data.nombre,
                    apellidoPaterno: response.data.apellidoPaterno,
                    apellidoMaterno: response.data.apellidoMaterno,
                    correo: response.data.correo,
                    telefono: response.data.telefono,
                    celular: response.data.celular,
                    direccion: response.data.direccion,
                    persona: response.data.estatus,
                    estatus: response.data.estatus               
                });
                $scope.ContRegistros = $scope.ListClienteMod.length;
            }).catch(function (err) {
                console.log(err);
                alert('Excepcion Al Guardar.' + err);
            });
        }
        $scope .Cliente_Sel =function (Estado) {
             $http({
                url: "https://localhost:7039/Api/Clientes",
                method: "get",
                params:{status:Estado}
            }).then(function (response) {
                $scope.ListClienteMod = response.data;              
                $scope.ContRegistros = response.length;
            }).catch(function (err) {
                alert('Excepcion Sel.' + err.data);
            });
        }
        $scope .Cliente_SelbyId =function (Id) {
            $http({
               url: "https://localhost:7039/Api/Clientes/GetCliente",
               method: "get",
               params:{Id:Id}
           }).then(function (response) {
               $scope.Edit = response.data;     
               console.log(response.data);       
           }).catch(function (err) {
               alert('Excepcion Sel.' + err.data);
           });
       }
        $scope.Cliente_LoadEdit = function (e) {
            //EditCliente
            $scope.EditCliente= e;           
        };
        $scope.Cliente_Upd = function (EditCliente) {
            var i;
            for (i = 0; i < $scope.ListClienteMod.length; i++) {
                if ($scope.ListClienteMod[i].IdCliente === EditCliente.IdCliente) {
                    $http({
                        url: "https://localhost:7039/api/Clientes/Cliente_Upd",
                        method: "POST",
                        data: EditCliente
                    }).then(function () {
                        $scope.ListClienteMod[i] = EditCliente;                      
                    }).catch(function (err) {
                        alert('Excepcion Upd.' + err.data);
                    });
                    break;
                }
            }
        };
        $scope .Cliente_Dela =function (Id) {
            $http({
               url: "https://localhost:7039/Api/Clientes",
               method: "DELETE",
               params:{id   :Id}
           }).then(function (response) {
               $scope.ListClienteMod = response.data;              
               $scope.ContRegistros = response.length;
           }).catch(function (err) {
               alert('Excepcion del.' + err.data);
           });
       }
        $scope.Cliente_Del = function (Id) {            var i;
            for (i = 0; i < $scope.ListClienteMod.length; i++) {
                if ($scope.ListClienteMod[i].idCliente === Id) {
                    // Make a DELETE request to the API
                    $http({
                        url: "https://localhost:7039/Api/Clientes",
                        method: "DELETE",
                        params: { id: Id }
                    }).then(function (response) {
                        if ($scope.Estado === 'A') {
                            // If the status is 'A', remove the client from the list
                            $scope.ListClienteMod.splice(i, 1);
                            $scope.ContRegistros = $scope.ListClienteMod.length;
                        } else {
                            // If the status is not 'A', update the client's status to 'C'
                            $scope.ListClienteMod[i].estatus = 'C';
                        }
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