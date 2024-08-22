const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');

const routerHome = require('./router/home')
const routerProducts = require('./router/products')

const app = express()

//Settings
app.set('port', process.env.PORT || 4000);
app.set('host','http://127.0.0.1')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

/*Middlewares*/ 
app.use(morgan('dev'))
// Seteamos para procesar datos enviados desde formularios.
app.use(express.json())
app.use(express.urlencoded({extended:false})) //para imagenes, archivos
// Seteamos la carpeta para archivos estaticos
app.use(express.static('public'))
app.use(express.static('src/uploads/'))

//Seteamos la carpeta para variables de entorno
// dotenv.config({path: 'env/.env'})
dotenv.config()

// Para poder trabajar con cookies
app.use(cookieParser())

/*Routes*/
app.use('/',routerHome)
app.use(routerProducts)

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//Listening
app.listen(app.get('port'), console.log( `Server listening on url: ${app.get('host')}:${app.get('port')}` ))

