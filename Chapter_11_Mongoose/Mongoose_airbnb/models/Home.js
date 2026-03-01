const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  homeName: {type: String, required: true}, 
  price: {type: Number, required: true}, 
  location: {type: String, required: true}, 
  rating: {type: Number, required: true}, 
  photoUrl: String, 
  description: String,
  isInWishlist: {type: Number, default: 0}
})

homeSchema.pre('findOneAndDelete', async function(next) {
  const Wishlist = require('./Wishlist');
  const homeId = this.getQuery()['_id'];
  await Wishlist.deleteOne({homeId});
});
 

module.exports = mongoose.model('Home',homeSchema);
