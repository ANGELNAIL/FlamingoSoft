const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Habilita CORS para todas las solicitudes
app.use(cors());
// Configurar la carpeta de archivos estáticos
app.use(express.static(__dirname));
// Resto de tu código de servidor aquí...
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
