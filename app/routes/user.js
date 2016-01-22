var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
/* GET users listing. */
router.get('/list', userController.list);
router.get('/:id', userController.get);

router.post('/create', userController.create);

router.get('/lottery', userController.lottery);

module.exports = router;
