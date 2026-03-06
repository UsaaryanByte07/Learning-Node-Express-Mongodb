const express = require('express')
const authRouter = express.Router();
const {getLogin, postLogin, postLogout} = require('../controllers/authController')

authRouter.get('/login',getLogin);

authRouter.post('/login',postLogin);

authRouter.post('/logout',postLogout)

module.exports = {
    authRouter,
}