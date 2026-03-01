const Home = require('../models/Home')
const Wishlist = require('../models/Wishlist')

const getIndex = (req,res,next) => {
    res.render('store/index', {pageTitle: 'Airbnb'});
}

const getHomes = async (req,res,next)=> {
    try {
        const addedHomes = await Home.find();
        res.render('store/homes', {addedHomes, pageTitle: 'Houses'});
    } catch (error) {
        console.log('Error fetching homes:', error.message);
        res.render('store/homes', {addedHomes: [], pageTitle: 'Houses'});
    }
}

const getHomeDetails = async (req,res,next)=> {
    const homeId = req.params.homeId;
    try {
        const home = await Home.findById(homeId);
        res.render('store/home-details', {home, pageTitle: 'Home Details'});
    } catch (error) {
        console.log(`Error fetching home with home id ${homeId}`, error.message);
        res.render('store/home-details', {home: undefined, pageTitle: 'Home Not Found'});
    }
}

const getWishlist = async (req,res,next)=> {
    try {
        const wishlistHomes = await Wishlist.find().populate('homeId');
        
        /* POPULATE EXPLANATION:
         * 1. WITHOUT .populate(): wishlistHomes = [{ _id: "...", homeId: "64a1b2c3d4e5f6" }] 
         *    -> homeId contains just ObjectId reference
         * 
         * 2. WITH .populate('homeId'): wishlistHomes = [{ _id: "...", homeId: { _id: "64a1b2c3d4e5f6", homeName: "Villa", price: 200, location: "Paris", rating: 4.5, ... } }]
         *    -> homeId now contains FULL Home document with all properties
         * 
         * 3. AFTER .map(item => item.homeId): wishlist = [{ _id: "64a1b2c3d4e5f6", homeName: "Villa", price: 200, location: "Paris", rating: 4.5, ... }]
         *    -> Returns array of complete Home objects, NOT just IDs
         *    -> EJS template receives full Home objects with homeName, price, location etc.
         */
        const wishlist = wishlistHomes.map(item => item.homeId);
        res.render('store/wishlist', {wishlist, pageTitle: 'Wishlist'});
    } catch (error) {
        console.log('Error fetching wishlist:', error.message);
        res.render('store/wishlist', {wishlist: [], pageTitle: 'Wishlist'});
    }
}

const postAddWishlist = async (req,res,next)=> {
    try {
        const newWishlistItem = new Wishlist({homeId: req.body._id});
        await newWishlistItem.save();
        await Home.findByIdAndUpdate(req.body._id, {isInWishlist: 1});
    } catch (error) {
        console.log(`Error adding to wishlist: ${error.message}`);
    } finally{
        res.redirect('/wishlist')
    }
}

const postRemoveWishlist = async (req,res,next)=> {
    try {
        const homeId = req.body._id;
        await Wishlist.deleteOne({homeId});
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