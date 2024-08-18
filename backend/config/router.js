const express = require('express')
const authenticateUser = require('../middleware/authentication')
// const upload = require('./multer')
const category_controller = require('../app/controller/category_controller')
const user_controller = require('../app/controller/user_controller')
const sub_category_controller = require('../app/controller/sub_category_controller')
const product_controller = require('../app/controller/product_controller')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: "uploads/" })
router.use(express.urlencoded({ extended: true }))

//user routes
router.post('/register', user_controller.register)
router.post('/login', user_controller.login)
router.get('/userInfo', authenticateUser, user_controller.getById)
router.post('/forgot-password',user_controller.forgotPas)
router.route('/reset-password/:token')
    .get(user_controller.handleResetPassword)
    .post(user_controller.handleResetPassword)


// Category Routes
router.post('/category', authenticateUser, (req, res, next) => {
    console.log(req.body); next()
}, upload.single('image'), category_controller.create);
router.get('/category/:id', authenticateUser, category_controller.getById);
router.get('/category', authenticateUser, category_controller.getAll);
router.put('/category/:id', authenticateUser, upload.single('image'), category_controller.update);
router.delete('/category/:id', authenticateUser, category_controller.delete);

// SubCategory Routes
router.post('/sub-category', authenticateUser,upload.single('image'), sub_category_controller.create);
router.get('/sub-category/:id', authenticateUser, sub_category_controller.getById);
router.get('/sub-category', authenticateUser, sub_category_controller.getAll);
router.put('/sub-category/:id', authenticateUser, upload.single('image'), sub_category_controller.update);
router.delete('/sub-category/:id', authenticateUser, sub_category_controller.delete);

// Product Routes
router.post('/product', authenticateUser, upload.single('image'), product_controller.create);
router.get('/product/:id', authenticateUser, product_controller.getById);
router.get('/product', authenticateUser, product_controller.getAll);
router.put('/product/:id', authenticateUser, upload.single('image'), product_controller.update);
router.delete('/product/:id', authenticateUser, product_controller.delete);

module.exports = router