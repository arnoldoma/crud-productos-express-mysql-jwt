const express = require('express')
const productsController = require('../controllers/productsController')
const authController = require('../controllers/authController')

const router = express.Router()

//FrontEnd
router.get('/products', authController.isAuthenticated, productsController.list) // Api y frontend
router.get('/products/add', authController.isAuthenticated, (req, res)=>{
    res.render('products_add',{ alert:false})
}) // Api y frontend

router.get('/products/edit/:id', authController.isAuthenticated, productsController.edit)
router.get('/products/delete/:id', authController.isAuthenticated, productsController.delete) 

// para Backend

router.post('/products/update/:id', authController.isAuthenticated, productsController.upload, productsController.update)
router.post('/products/add', productsController.upload, productsController.save) // Api y frontend
router.put('/products/update/:id', productsController.update)
router.patch('/products/update/:id', productsController.update)
router.delete('/products/delete/:id', authController.isAuthenticated, productsController.delete) //Para api



module.exports = router;