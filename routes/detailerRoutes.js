const express = require('express');
const router = express.Router();
const {createDetailerAccount, loginDetailer, getDetailers} = require('../controllers/detailerController');
const detailerValidator = require('../middleware/detailerValidator');
const validateRequest = require('../middleware/validateRequest');
const passwordValidation = require('../middleware/passwordValidator');

router.post('/login', loginDetailer);
router.post('/register',detailerValidator,passwordValidation,validateRequest, createDetailerAccount);

module.exports = router;