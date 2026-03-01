const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database-utils");

class Wishlist {
  static async fetchWishlist() {
    const db = getDb();
    return db.collection("homes").find({ isInWishlist: 1 }).toArray();
  }

  static async addToWishlist(homeId) {
    const db = getDb();
    return db
      .collection("homes")
      .updateOne({ _id: new ObjectId(String(homeId)) }, { $set: { isInWishlist: 1 } });
  }

  static async removeFromWishlist(homeId) {
    const db = getDb();
    return db
      .collection("homes")
      .updateOne({ _id: new ObjectId(String(homeId)) }, { $set: { isInWishlist: 0 } });
  }
}

module.exports = {
  Wishlist,
};
