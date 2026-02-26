const fs = require("fs").promises; // Use promises version of fs whenever using promises or async-await
const path = require("path");
const rootDir = require("../utils/path-util");

const homeFilePath = path.join(rootDir, "data", "home.json");

class Home {
  constructor(homeName, price, location, rating, photoUrl) {
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.isInWishlist = false;
  }

  async save() {
    try {
      const addedHomes = await Home.fetchAll();
      this.id = (Date.now() + Math.random()).toString();
      addedHomes.push(this);
      await fs.writeFile(homeFilePath, JSON.stringify(addedHomes));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to save home: ${error.message}`);
    }
  }

  async edit() {
    try {
      const addedHomes = await Home.fetchAll();
      const newAddedHomes = addedHomes.map((home) =>
        home.id === this.id ? this : home,
      );
      await fs.writeFile(homeFilePath, JSON.stringify(newAddedHomes));
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to edit home: ${error.message}`);
    }
  }

  static async removeById(homeId) {
    try {
      const addedHomes = await Home.fetchAll();
      const newAddedHomes = addedHomes.filter(home => home.id !== homeId);
      await fs.writeFile(homeFilePath, JSON.stringify(newAddedHomes));
    } catch (err) {
      throw new Error(
        `Failed to remove the home with home id ${homeId}: ${err.message}`,
      );
    }
  }

  static async fetchAll() {
    try {
      const data = await fs.readFile(homeFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async fetchById(homeId) {
    try {
      const homes = await Home.fetchAll();
      const home = homes.find((home) => home.id === homeId);
      return home;
    } catch (err) {
      throw new Error(
        `Failed to get the Home with Home id ${homeId}` + `${err.message}`,
      );
    }
  }

  static async toggleIsInWishlist(homeId) {
    try {
      const addedHomes = await Home.fetchAll();
      const newAddedHomes = addedHomes.map((home) => {
        if (home.id === homeId) {
          home.isInWishlist = !home.isInWishlist;
        }
        return home;
      });
      await fs.writeFile(homeFilePath, JSON.stringify(newAddedHomes));
    } catch (err) {
      throw new Error(
        `Failed to toggle the isInWishlist value of Home with Home id ${homeId}` +
          `${err.message}`,
      );
    }
  }
}

module.exports = {
  Home,
};
