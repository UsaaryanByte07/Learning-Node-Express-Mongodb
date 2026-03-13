const express = require('express')
const storeRouter = express.Router();
const {getIndex, getHomeDetails, getHomes, postAddWishlist,postRemoveWishlist, getWishlist} = require('../controllers/storeController')

storeRouter.get('/',getIndex)

storeRouter.get('/homes',getHomes)

storeRouter.get('/homes/:homeId',getHomeDetails);

storeRouter.get('/wishlist',getWishlist)

storeRouter.post('/wishlist/add',postAddWishlist)
storeRouter.post('/wishlist/remove',postRemoveWishlist)

module.exports = storeRouter;