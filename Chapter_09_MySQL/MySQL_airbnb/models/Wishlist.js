const airbnbDb = require("../utils/database-utils");

class Wishlist {

  static async fetchWishlist() {
    const [homes] = await airbnbDb.execute('SELECT * FROM homes WHERE isInWishlist = ?',[1]);
    return homes;
  }

  static async addToWishlist(homeId) {
    return airbnbDb.execute('UPDATE homes SET isInWishlist = ? WHERE id = ? ', [1,homeId])
  }

  static async removeFromWishlist(homeId) {
    return airbnbDb.execute('UPDATE homes SET isInWishlist = ? WHERE id = ? ', [0,homeId])
  }
}

module.exports = {
  Wishlist,
};
