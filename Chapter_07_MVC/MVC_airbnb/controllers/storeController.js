const {Home} = require('../models/Home')

exports.getHome = async (req,res,next)=> {
    try {
        const addedHomes = await Home.fetchAll();
        res.render('index', {addedHomes, pageTitle: 'Apka Apna Airbnb'});
    } catch (error) {
        console.log('Error fetching homes:', error.message);
        res.render('index', {addedHomes: [], pageTitle: 'Apka Apna Airbnb'});
    }
}