const {Router} = require('express');
const authorController = require('../controllers/author');
const isAuthenticated = require('../middleware/isAuthenticated');
const {authorValidator, authorEditValidator} = require('../utils/validators');

const router = Router();

router.get('/', authorController.getAuthors);

router.get('/add', isAuthenticated, authorController.getAddAuthor);

router.post('/add', isAuthenticated, authorValidator, authorController.postAddAuthor);

router.get('/:slug', authorController.getAuthor);

router.get('/:slug/edit', isAuthenticated, authorController.getEditAuthor);

router.post('/:slug/edit', isAuthenticated, authorEditValidator, authorController.postEditAuthor);

router.post('/:slug/delete', isAuthenticated, authorController.postDeleteAuthor);

module.exports = router;