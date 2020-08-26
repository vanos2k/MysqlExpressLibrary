const {Router} = require('express');
const homeController = require('../controllers/home');

const router = Router();

router.get('/', homeController.getMainPage);

module.exports = router;

