const {Home} = require('../models/Home')
const {Wishlist} = require('../models/Wishlist')

const getIndex = (req,res,next) => {
    res.render('store/index', {pageTitle: 'Airbnb'});
}

const getHomes = async (req,res,next)=> {
    try {
        const [addedHomes] = await Home.fetchAll();
        res.render('store/homes', {addedHomes, pageTitle: 'Houses'});
    } catch (error) {
        console.log('Error fetching homes:', error.message);
        res.render('store/homes', {addedHomes: [], pageTitle: 'Houses'});
    }
}

const getHomeDetails = async (req,res,next)=> {
    const homeId = req.params.homeId;
    try {
        const [homes] = await Home.fetchById(homeId);
        const home = homes[0]; // Get the first (and should be only) home from the result array
        res.render('store/home-details', {home, pageTitle: 'Home Details'});
    } catch (error) {
        console.log(`Error fetching home with home id ${homeId}`, error.message);
        res.render('store/home-details', {home: undefined, pageTitle: 'Home Not Found'});
    }
}

const getWishlist = async (req,res,next)=> {
    try {
        const wishlist = await Wishlist.fetchWishlist();
        res.render('store/wishlist', {wishlist, pageTitle: 'Wishlist'});
    } catch (error) {
        console.log('Error fetching wishlist:', error.message);
        res.render('store/wishlist', {wishlist: [], pageTitle: 'Wishlist'});
    }
}

const postAddWishlist = async (req,res,next)=> {
    try {
        const homeId = req.body.id;
        await Wishlist.addToWishlist(homeId);
    } catch (error) {
        console.log(`Error adding to wishlist: ${error.message}`);
    } finally{
        res.redirect('/wishlist')
    }
}

const postRemoveWishlist = async (req,res,next)=> {
    try {
        const homeId = req.body.id;
        await Wishlist.removeFromWishlist(homeId);
    } catch (error) {
        console.log(`Error in removing from wishlist: ${error.message}`);
    } finally{
        res.redirect('/wishlist')
    }
}

module.exports = {
    getIndex,
    getHomeDetails,
    getHomes,
    getWishlist,
    postAddWishlist,
    postRemoveWishlist,
}