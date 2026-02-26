const express = require("express");
const {useNotFoundPage} = require('../controllers/notFoundController');

const notFoundRouter = express.Router();

notFoundRouter.use(useNotFoundPage);

module.exports = notFoundRouter
