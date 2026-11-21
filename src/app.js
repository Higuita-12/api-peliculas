const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const rutas = require('./routes');
const { noEncontrado, manejoErrores } = require('./middlewares/manejoErrores');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

/*app.get('/', (req, res) =>
  res.json({
    ok: true,
    api: 'API REST Películas - IU Digital',
    endpoints: ['/api/generos', '/api/directores', '/api/productoras', '/api/tipos', '/api/medias'],
  })
);*/

// Publica el frontend que está dentro de la carpeta public.
app.use(express.static(path.join(__dirname, '../backend')));

// Al entrar a la dirección principal se muestra la página web.
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../backend/index.html'))
);
app.use('/api', rutas);
app.use(noEncontrado);
app.use(manejoErrores);

module.exports = app;

