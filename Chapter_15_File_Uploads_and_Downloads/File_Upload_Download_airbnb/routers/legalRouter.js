const express = require('express')
const legalRouter = express.Router();
const {getTermsConditions, getPrivacyPolicy} = require('../controllers/legalController')

legalRouter.get('/terms-and-conditions',getTermsConditions);
legalRouter.get('/privacy-policy',getPrivacyPolicy);

module.exports = {
    legalRouter,
}