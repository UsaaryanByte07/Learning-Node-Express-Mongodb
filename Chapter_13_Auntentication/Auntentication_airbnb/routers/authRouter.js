const express = require('express')
const authRouter = express.Router();
const {getLogin, postLogin, postLogout, getSignup, postSignup} = require('../controllers/authController')

authRouter.get('/login',getLogin);

authRouter.get('/signup',getSignup);

authRouter.post('/login',postLogin);

authRouter.post('/signup',postSignup);

authRouter.post('/logout',postLogout);

module.exports = {
    authRouter,
}