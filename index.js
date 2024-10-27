const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

let tareas = [];

// Página de inicio de sesión
app.get('/', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <label>Usuario:</label><input type="text" name="username"/><br/>
      <label>Contraseña:</label><input type="password" name="password"/><br/>
      <button type="submit">Iniciar sesión</button>
    </form>
  `);
});

// Manejar el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Error de autenticación: Usuario o contraseña incorrectos.');
  }
});

// Página protegida del dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.send(`
      <h1>Bienvenido al Dashboard!</h1>
      <p>Usuario registrado: ${req.session.username}</p>
      <a href="/logout">Cerrar sesión</a>
      <h2>Registrar Nueva Tarea</h2>
      <form id="taskForm" action="/add-task" method="post" onsubmit="return validateForm()">
        <label>Código de la tarea (id):</label><input type="text" name="id" required/><br/>
        <label>Título de la tarea:</label><input type="text" name="title" required/><br/>
        <label>Descripción de la tarea:</label><input type="text" name="description" required/><br/>
        <label>Fecha de inicio:</label><input type="date" name="startDate" required/><br/>
        <label>Nombre del cliente:</label><input type="text" name="clientName" required/><br/>
        <label>Id del proyecto:</label><input type="text" name="projectId" required/><br/>
        <label>Sección de comentarios:</label><textarea name="comments" required></textarea><br/>
        <label>Estatus:</label><input type="text" name="status" value="Por hacer" readonly/><br/>
        <button type="submit">Registrar tarea</button>
      </form>
      <h2>Lista de Tareas</h2>
      <table border="1">
        <tr>
          <th>Código</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha de inicio</th>
          <th>Nombre del cliente</th>
          <th>Id del proyecto</th>
          <th>Comentarios</th>
          <th>Estatus</th>
        </tr>
        ${tareas.map(tarea => `
          <tr>
            <td>${tarea.id}</td>
            <td>${tarea.title}</td>
            <td>${tarea.description}</td>
            <td>${tarea.startDate}</td>
            <td>${tarea.clientName}</td>
            <td>${tarea.projectId}</td>
            <td>${tarea.comments}</td>
            <td>${tarea.status}</td>
          </tr>
        `).join('')}
      </table>
      <script>
        function validateForm() {
          const form = document.getElementById('taskForm');
          const inputs = form.querySelectorAll('input[required], textarea[required]');
          for (let input of inputs) {
            if (!input.value) {
              alert('Por favor, completa todos los campos.');
              return false;
            }
          }
          return true;
        }
      </script>
    `);
  } else {
    res.redirect('/');
  }
});

// Manejar el registro de nuevas tareas
app.post('/add-task', (req, res) => {
  const { id, title, description, startDate, clientName, projectId, comments, status } = req.body;
  const nuevaTarea = { id, title, description, startDate, clientName, projectId, comments, status };
  tareas.push(nuevaTarea);
  res.redirect('/dashboard');
});

// Manejar el cierre de sesión
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
