const express = require("express");

const hostRouter = express.Router();

hostRouter.get("/add-home", (req, res, next) => {
    res.render('add-home',{pageTitle: 'Add Home'})
});

const addedHomes = [];

hostRouter.post('/add-home',(req,res,next) => {
    addedHomes.push(req.body);
    res.render('home-added',{pageTitle: 'Home Added'})
})

module.exports = {
    hostRouter,
    addedHomes,
};
