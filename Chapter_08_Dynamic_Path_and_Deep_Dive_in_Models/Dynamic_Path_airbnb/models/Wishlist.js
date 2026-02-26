const fs = require("fs").promises; // Use promises version of fs whenever using promises or async-await
const path = require("path");
const rootDir = require("../utils/path-util");

const wishlistFilePath = path.join(rootDir, "data", "wishlist.json");
const { Home } = require("./Home");

class Wishlist {
  static async fetchAll() {
    try {
      const data = await fs.readFile(wishlistFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async fetchWishlist() {
    try {
      let wishlistIds = await fs.readFile(wishlistFilePath, "utf8");
      wishlistIds = JSON.parse(wishlistIds);
      const addedHomes = await Home.fetchAll();
      const wishlist = addedHomes.filter((home) => {
        return wishlistIds.includes(home.id);
      });
      return wishlist;
    } catch (error) {
      return [];
    }
  }

  static async addToWishlist(homeId) {
    try {
      const wishlistIds = await Wishlist.fetchAll();
      if (!wishlistIds.includes(homeId)) {
        wishlistIds.push(homeId);
        await fs.writeFile(wishlistFilePath, JSON.stringify(wishlistIds));
        await Home.toggleIsInWishlist(homeId);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      throw new Error(
        `Failed to add the home with home id ${homeId} to wishlist: ${err.message}`,
      );
    }
  }

  static async removeFromWishlist(homeId) {
    try {
      const wishlistIds = await Wishlist.fetchAll();
      const newWishlistIds = wishlistIds.filter((id) => {
        return id !== homeId;
      });
      await fs.writeFile(wishlistFilePath, JSON.stringify(newWishlistIds));
      await Home.toggleIsInWishlist(homeId);
      return { success: true };
    } catch (err) {
      throw new Error(
        `Failed to remove the home with home id ${homeId} from wishlist: ${err.message}`,
      );
    }
  }
}

module.exports = {
  Wishlist,
};
