// Importar dependencias
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./database/connection");

// Mensaje de bienvenido
console.log("API NODE para red social arrancada");

// Conexion a la base de datos
connection();

// Crear servidor de node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors()); // middleware, se ejecuta antes que cualquier otra cosa

// Convertir los datos del body a objetos JS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cargar conf rutas
const UserRoutes = require("./routes/user");
const FollowRoutes = require("./routes/follow");
const PublicationRoutes = require("./routes/publication");

app.use("/api/user", UserRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/publication", PublicationRoutes);


// Poner servidor a escuchar
app.listen(port, () => {
    console.log(`Servidor arrancado en el puerto ${port}`);
});