const express = require('express')
const {addedHomes} = require('./hostRouter')

const storeRouter = express.Router();

storeRouter.get('/',(req,res,next)=> {
    console.log(addedHomes)
    res.render('index',{addedHomes, pageTitle: 'Apka Apna Airbnb'})
})



module.exports = storeRouter;