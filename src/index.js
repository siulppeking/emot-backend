require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./database');
const v1AuthRouter = require('./routers/auth.router');
const v1PublicacionRouter = require('./routers/publicacion.router');

const app = express();

// configuracion de morgan
app.use(morgan('dev'));

// configuracion de cors
app.use(cors());

// configuracion de JSON en express
app.use(express.json());

// rutas de la aplicacion
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/publicacion', v1PublicacionRouter);

// configuracion del puerto
const PORT = process.env.PORT || 3000;

// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

connectDatabase()