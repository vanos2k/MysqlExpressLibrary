const {Router} = require('express');
const accountController = require('../controllers/account');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = Router();

router.get('/', isAuthenticated, accountController.getAccount);

router.post('/', isAuthenticated, accountController.postAccount);

module.exports = router;