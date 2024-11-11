const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para manejar JSON
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

let tareas = [];

// Página de inicio de sesión
app.get('/', (req, res) => {
  res.send(`
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Inicio de Sesión</title>
    </head>
    <body>
      <form action="/login" method="post">
        <label>Usuario:</label><input type="text" name="username"/><br/>
        <label>Contraseña:</label><input type="password" name="password"/><br/>
        <button type="submit">Iniciar sesión</button>
      </form>
    </body>
    </html>
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
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Bienvenido al Dashboard!</h1>
        <p>Usuario registrado: ${req.session.username}</p>
        <a href="/logout">Cerrar sesión</a>
        <h2>Registrar Nueva Tarea</h2>
        <form id="taskForm" action="/add-task" method="post">
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
        <table border="1" id="tasksTable">
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha de Inicio</th>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th>Comentarios</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
          ${tareas.map(tarea => `
            <tr>
              <td>${tarea.id}</td>
              <td>${tarea.title}</td>
              <td>${tarea.description}</td>
              <td>${tarea.startDate}</td <td>${tarea.clientName}</td>
              <td>${tarea.projectId}</td>
              <td>${tarea.comments}</td>
              <td>${tarea.status}</td>
              <td>
                <button onclick="editTask('${tarea.id}')">Editar</button>
                <button onclick="deleteTask('${tarea.id}')">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </table>

        <script>
          function editTask(id) {
            alert('Funcionalidad de edición no implementada para la tarea con ID: ' + id);
          }

          function deleteTask(id) {
            if (confirm('¿Estás seguro de que deseas eliminar la tarea con ID: ' + id + '?')) {
              fetch('/delete-task/' + id, {
                method: 'DELETE',
              })
              .then(response => {
                if (response.ok) {
                  alert('Tarea eliminada con éxito');
                  location.reload();
                } else {
                  alert('Error al eliminar la tarea');
                }
              })
              .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al eliminar la tarea.');
              });
            }
          }
        </script>
      </body>
      </html>
    `);
  } else {
    res.redirect('/');
  }
});

// Ruta para agregar una tarea
app.post('/add-task', (req, res) => {
  const nuevaTarea = req.body;
  tareas.push(nuevaTarea);
  res.redirect('/dashboard');
});

// Ruta para eliminar una tarea
app.delete('/delete-task/:id', (req, res) => {
  const { id } = req.params;
  tareas = tareas.filter(tarea => tarea.id !== id);
  res.sendStatus(200);
});

// Ruta para obtener las tareas
app.get('/get-tasks', (req, res) => {
  res.json(tareas);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});