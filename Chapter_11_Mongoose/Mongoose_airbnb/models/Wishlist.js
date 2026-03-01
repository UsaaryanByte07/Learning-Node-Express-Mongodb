const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    unique: true,
  }
});

wishlistSchema.pre('deleteOne', async function(next) {
  const Home = require('./Home');
  const homeId = this.getQuery()['homeId']; // Get homeId from query, not _id
  await Home.findByIdAndUpdate(homeId, {isInWishlist: 0});
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
