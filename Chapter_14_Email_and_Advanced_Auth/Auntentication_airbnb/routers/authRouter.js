const express = require('express')
const authRouter = express.Router();
const {getForgotPassword, getResetPassword, postForgotPassword, postResetPassword} = require('../controllers/auth/forgetPasswordController');
const {getLogin, postLogin, postLogout} = require('../controllers/auth/loginController');
const {getVerifyOtp, postVerifyOtp} = require('../controllers/auth/verifyOtpController');
const {getSignup, postSignup} = require('../controllers/auth/signupController');

authRouter.get('/login',getLogin);

authRouter.get('/signup',getSignup);

authRouter.get('/verify-otp', getVerifyOtp);

authRouter.get('/forgot-password', getForgotPassword)

authRouter.get('/reset-password', getResetPassword)

authRouter.post('/reset-password', postResetPassword)

authRouter.post('/forgot-password', postForgotPassword)

authRouter.post('/verify-otp', postVerifyOtp);

authRouter.post('/login',postLogin);

authRouter.post('/signup',postSignup);

authRouter.post('/logout',postLogout);


module.exports = {
    authRouter,
}