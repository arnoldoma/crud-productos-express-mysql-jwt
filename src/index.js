const mysql = require('mysql2');

const conexion = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'@Amadev',
        database:'carrito'
})

conexion.connect( (error) =>{
    if (error) {
        throw error
    }else{
        console.log( "Conexion exitosa" );
    }
})

// console.log( conexion.query('SELECT * FROM producto') );
conexion.end()