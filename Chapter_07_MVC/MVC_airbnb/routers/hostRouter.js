const express = require("express");
const hostController = require('../controllers/hostController')

const hostRouter = express.Router();

hostRouter.get("/add-home", hostController.getAddHome);


hostRouter.post('/add-home',hostController.postAddHome)

module.exports = {
    hostRouter,
};
