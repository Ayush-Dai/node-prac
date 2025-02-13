const express = require('express');
const router = express.Router();
const { registerUser, loginUser,changePassword } = require('../controllers/auth-controller');
const authMiddleware =require('../middleware/auth-middleware')



//all routes are related ot authentication & authorization
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changePassword',authMiddleware,changePassword);



module.exports = router;




