// Upload Images
const multer = require('multer')
const path = require('path')
const db = require('../database/db');
const {unlink} = require('fs-extra');
const { url } = require('inspector');

const controller = {};

controller.list = async (req, res) => {
    try {
        const connection = await db.getConnection();
        // const [[products]] = await connection.query("call carrito.prc_products();");
        const [products] = await connection.query("SELECT * from producto");
        if (products.length === 0) {
            res.render('products', {
                alert: true,
                alertTitle: "Error en la consulta",
                alertMessage: "No se encontro el listado de productos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'products'
            })
        }else{
            res.render('products',
                {user:req.user, alert:false,products: products, msg:{
                alert: true,
                alertTitle: "Bienvenido",
                alertMessage: "Listado de producto",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1000,
                ruta: 'products'
            }})
            // res.render('products', 
            //     { user: req.user, alert:false, products: products },
            //     {
            //     alert: true,
            //     alertTitle: "Bienvenido",
            //     alertMessage: "Listado de producto",
            //     alertIcon: 'success',
            //     showConfirmButton: false,
            //     timer: 1000,
            //     ruta: ''
            // } )
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

controller.save = async (req, res) => {
    let ulrImg = '';
    const { nombre, precio } = req.body
    if (!req.file) {ulrImg = 'imgdefault.png' }else{ ulrImg = req.file.filename }
    if (!nombre || !precio) {
        return res.json({
            message: 'No hay datos'
        })
    }
    const data = {
        nombre,
        urlImagen: ulrImg,
        precio
    }
    // res.json(data)
    try {
        const connection = await db.getConnection();
        await connection.query('INSERT INTO producto set ?', [data])
        // res.json({
        //     message:'Producto guadado exitosamente!'
        // })
        res.redirect('/products')

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

controller.edit = async (req, res) => {
    const { id } = req.params
    try {
        const connection = await db.getConnection();
        const [[product]] = await connection.query("SELECT * FROM producto WHERE id = ?", [id]);
        if (product.length === 0) {
            return res.json({
                message: 'El producto no fue encontrado'
            })
        }
        // res.json(product)
        res.render('products_edit', { user: req.user, alert:false, product: product })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

controller.update = async (req, res) => {

    let data = {};
    const { id } = req.params;
    const { nombre, precio } = req.body
    if (!nombre || !precio) {
        return res.json({
            message: 'No hay datos'
        })
    }  

    if (!req.file) {
        data = {
            nombre,
            precio
        }
    }else{ 
        data = {
        nombre,
        urlImagen: req.file.filename,
        precio}
     }
  
    try {        
        const connection = await db.getConnection();
        const product = await connection.query("UPDATE producto SET ? WHERE id = ?", [data, id]);

        // if (product.affectedRows === 0) {
        //     return res.json({
        //         message: 'El producto no se pudo actualizar correctamente'
        //     })
        // }
        // res.json({
        //     message: `El producto fue actualizado correctamente.`
        // });
        res.redirect('/products')
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

}

controller.delete = async (req, res) => {
    const { id } = req.params

    try {
        const connection = await db.getConnection();
        const [[product]] = await connection.query("SELECT * FROM producto WHERE id = ?", [id]);
        const [result] = await connection.query('DELETE FROM producto WHERE id = ?', [id])
        if (result.affectedRows === 0) {
            return res.status(204).json({
                message: 'Error al eliminar el producto'
            })
        }
        unlink(path.resolve('src/uploads/products/'+product.urlImagen))
        // res.json({
        //     message: `El producto fue eliminado correctamente.`
        // });
        res.redirect('/products')

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

controller.upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate fo upload')
    }
}).single('urlImagen') //.array('urlImages', 3) se utiliza array y se pasa la cantidad de imagenes cuando son varios

module.exports = controller;