require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const connectDatabase = require('./database');
const v1AuthRouter = require('./routers/auth.router');
const v1PublicacionRouter = require('./routers/publicacion.router');
const v1ComentarioRouter = require('./routers/comentario.router');
const v1ComunidadRouter = require('./routers/comunidad.router');

const app = express();

// tratamiento de archivos
app.use(fileUpload({
    useTempFiles: true,
}));

// configuracion de morgan
app.use(morgan('dev'));

// configuracion de cors
app.use(cors());

// configuracion de JSON en express
app.use(express.json());

// rutas de la aplicacion
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/publicaciones', v1PublicacionRouter);
app.use('/api/v1/comentarios', v1ComentarioRouter);
app.use('/api/v1/comunidades', v1ComunidadRouter);

// configuracion del puerto
const PORT = process.env.PORT || 3000;

// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

connectDatabase()