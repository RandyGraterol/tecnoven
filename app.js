require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/database');
const monitorRoutes = require('./routes/monitorRoutes');
const { checkStatus,getIntervaloEnMilisegundos} = require('./controllers/monitorController');
app.use(session({
    secret:'mi_secreto_seguir',
    resave: false,
    saveUninitialized:true,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 2
    }
}));

let intervaloId = null;

async function iniciarIntervaloDinamico() {
  const intervaloMs = await getIntervaloEnMilisegundos();

  if (intervaloId) clearInterval(intervaloId); // detener intervalo anterior si existe

  console.log(`🕒 Iniciando verificación cada ${intervaloMs / 60000} minutos`);

  intervaloId = setInterval(checkStatus, intervaloMs);
  checkStatus(); // ejecutar inmediatamente
}

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(expressLayouts);
// Ruta por defecto del layout
app.set('layout', 'layouts/layout'); // archivo: views/layouts/layout.ejs

app.use('/', monitorRoutes);

sequelize.sync({force:false}).then(async() => {
  console.log('Base de datos lista');
  app.listen(3000, () => console.log('Servidor en http://localhost:3000'));

  await iniciarIntervaloDinamico();
});
