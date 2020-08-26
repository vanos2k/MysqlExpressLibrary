const {Router} = require('express');
const bookController = require('../controllers/book');
const {bookValidator, bookEditValidor} = require('../utils/validators');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = Router();

router.get('/', bookController.getBooks);

router.get('/add', isAuthenticated, bookController.getAddBook);

router.post('/add', isAuthenticated, bookValidator, bookController.postAddBook);

router.get('/:slug', bookController.getBook);

router.get('/:slug/edit', isAuthenticated, bookController.getEditBook);

router.post('/:slug/edit', isAuthenticated, bookEditValidor, bookController.postEditBook);

router.post('/:slug/delete', isAuthenticated, bookController.postDeleteBook);

router.post('/:slug/rate', isAuthenticated, bookController.postRateBook);

module.exports = router;