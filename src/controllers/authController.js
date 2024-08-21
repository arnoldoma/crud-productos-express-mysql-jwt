const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../database/db');
const {promisify} = require('util');

const authController = {};

authController.save = async (req, res) => {
    const { nombre, email, password } = req.body
    let passHash = await bcryptjs.hash(password, 8)
    // console.log( passHash );
    if (!nombre || !email || !password) {
        return res.json({
            message: 'Todos los campos son obligatorios'
        })
    }
    const data = {
        nombre,
        email,
        password: passHash
    }
    try {
        const connection = await db.getConnection()
        await connection.query('INSERT INTO usuarios SET ?', [data])
        res.redirect('/login')
    } catch (error) {
        res.json(error)
    }

}

authController.login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese un usuario y contraseña",
            alertIcon: 'info',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        })

    } else {
        try {
            const conn = await db.getConnection()
            const [[result]] = await conn.query("SELECT * FROM usuarios WHERE email = ?", [email])
            if (!result || !(await bcryptjs.compare(password, result.password))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            } else {
                // Inicio de sesion
                const id = result.id;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_TIME_EXPIRES
                })
                //generamos el token SIN fecha de expiracion
                //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)

                const cookiesOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookiesOptions)
      
                res.render('login', {
                    alert: true,
                    alertTitle: "Bienvenido",
                    alertMessage: "Bienvenido al sistema FIXMA",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                    ruta: ''
                })
            }

        } catch (error) {
            console.log(error);
        }
    }
}

authController.isAuthenticated = async(req, res, next)=>{
    if (req.cookies.jwt){
        try {
            const decoficated = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            const conn = await db.getConnection()
            const [[results]] = await conn.query("SELECT * FROM usuarios WHERE id = ?", [decoficated.id])
            if(!results){return next()}
            req.user = results
            return next()
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')
    }
}

authController.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/login')
}
module.exports = authController;