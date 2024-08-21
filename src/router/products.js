const express = require('express')
const productsController = require('../controllers/productsController')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/products', authController.isAuthenticated, productsController.list) // Api y frontend

router.get('/products/add', authController.isAuthenticated, (req, res)=>{
    res.render('products_add',{user: req.user, alert:false})
}) // Api y frontend

router.post('/products/add', productsController.upload, productsController.save) // Api y frontend

router.get('/products/edit/:id', authController.isAuthenticated, productsController.edit)

router.post('/products/update/:id', productsController.upload, productsController.update)
// router.put('/products/update/:id', productsController.update)
// router.patch('/products/update/:id', productsController.update)

router.delete('/products/delete/:id', productsController.delete) //Para api
router.get('/products/delete/:id', authController.isAuthenticated, productsController.delete) // para fronend


module.exports = router;