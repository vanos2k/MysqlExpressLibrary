const {Router} = require('express');
const readerController = require('../controllers/reader');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = Router();

router.get('/:username/', readerController.getReader);

router.get('/:username/read', readerController.getReaderRead);

router.get('/:username/wanttoread', readerController.getReaderWanttoread);

router.post('/:username/find', readerController.postFindByReaderValue);

router.post('/:username/sort', readerController.postSortRating);

module.exports = router;