const {Home} = require('../models/Home')

const getAddHome = (req, res, next) => {
    res.render('add-home',{pageTitle: 'Add Home'})
}

const postAddHome = async (req,res,next) => {
    try {
        const {homeName, price, location, rating, photoUrl} = req.body;
        const newHome = new Home(homeName, price, location, rating, photoUrl);
        await newHome.save();
        res.render('home-added', {pageTitle: 'Home Added'});
    } catch (error) {
        console.log('Error Occurred while Writing the Data:', error.message);
        res.redirect('/addhome-err');
    }
}

module.exports = {
    getAddHome,
    postAddHome
}