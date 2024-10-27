// Importar las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// Crear una aplicación Express
const app = express();
const PORT = 3000;

// Configurar el middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar el middleware para manejar las sesiones
app.use(session({
  secret: 'secreto',  // Clave secreta para firmar la sesión
  resave: false,      // No volver a guardar la sesión si no ha cambiado
  saveUninitialized: true  // Guardar sesión no inicializada
}));

// Definir la ruta para la página de inicio de sesión
app.get('/', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <label>Usuario:</label><input type="text" name="username"/><br/>
      <label>Contraseña:</label><input type="password" name="password"/><br/>
      <button type="submit">Iniciar sesión</button>
    </form>
  `);
});

// Manejar el inicio de sesión cuando se envían los datos del formulario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verificar las credenciales del usuario
  if (username === 'admin' && password === 'password') {
    req.session.loggedIn = true;  // Marcar sesión como autenticada
    res.redirect('/dashboard');   // Redirigir al dashboard
  } else {
    res.send('Error de autenticación: Usuario o contraseña incorrectos.');
  }
});

// Definir la ruta para el dashboard protegido
app.get('/dashboard', (req, res) => {
  // Verificar si la sesión está autenticada
  if (req.session.loggedIn) {
    res.send('Bienvenido al Dashboard!');
  } else {
    res.redirect('/');  // Redirigir a la página de inicio de sesión si no está autenticado
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
