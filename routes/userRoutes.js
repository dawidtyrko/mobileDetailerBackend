const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userValidator = require('../middleware/userValidator');
const passwordValidation = require('../middleware/passwordValidator');
const {createUser,deleteUser,loginUser,updateUser,getUsers} = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest')
router.post('/login',loginUser);

router.post('/register',userValidator,passwordValidation,validateRequest,createUser);

module.exports = router;