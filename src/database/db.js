const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()
const connection = mysql.createConnection({
    // host: 'localhost',
    // port: '3306',
    // user: 'root',
    // password: '@Amadev',
    // database: 'carrito'
    
    host : process.env.DB_HOST,
    // port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE

})

const getConnection = async () => connection;

module.exports = {
    getConnection
};