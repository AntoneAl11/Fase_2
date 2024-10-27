//IMportaar las dependencias
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

//Crear una aplicación Express
const app = express();
const PORT = 3000;

//Configurar el middleware para parsear el cuerpo de las solicitudes
app.use(session({
    secret: "secreto", //Clave secreta para firmar la sesision
    resave: false, //No volver a guardar la session si no ah cambiado
    saveUninitilized: true //Guardar sesion no inicializada
}));

//Definir la ruta para la pagina de inicio de sesión
app.get("/", (req,res) =>{
    const {username, password} =req.body;

    //Verificar las credenciales del usuario
    if (username === "admin" && password === "password"){
        req.session.loggedIn = true; //Marcar sesion como autenticada
        res.redirect("/dashboard"); //redrigir al dashboard
    } else {
        res.send("Error de autenticaci´ón: Usuario o Contraseña incorrectos");
    }
});