const {Router} = require('express');
const authController = require('../controllers/auth');
const {registerValidator, loginValidator} = require('../utils/validators');

const router = Router();

router.get('/login', authController.getLogin);

router.post('/login', loginValidator, authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', registerValidator, authController.postRegister);

router.get('/logout', authController.getLogout);

module.exports = router;