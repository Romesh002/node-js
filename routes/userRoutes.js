const express = require('express');
const router = express.Router();
const upload = require('../config/multer.js')
const userController = require('../controllers/userController');
const AuthenticateSession = require('../middleware/AuthenticateSession')

router.post('/login', userController.login);
router.post('/create-user', upload.single('image'), userController.register);
router.get('/get-user', AuthenticateSession, userController.getUsers);

module.exports = router;
