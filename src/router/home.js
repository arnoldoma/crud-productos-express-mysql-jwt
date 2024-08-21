const {Router} = require('express')
const authController = require('../controllers/authController')

const router = Router()


router.get('/', authController.isAuthenticated, (req, res)=>{
    res.render('index', { title:"Dashboard", alert:false, user:req.user})
})

router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('register')
})

// Apis
router.post('/login', authController.login)
router.post('/register', authController.save)
router.get('/logout', authController.logout)

module.exports = router;