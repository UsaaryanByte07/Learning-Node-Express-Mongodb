const airbnbDb = require("../utils/database-utils");

class Home {
  constructor(homeName, price, location, rating, photoUrl, description) {
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this.isInWishlist = 0;
  }

  async save() {
    return airbnbDb.execute(
      "INSERT INTO homes (homeName, price, location, rating, photoUrl , description) VALUES (?,?,?,?,?,?)",
      [
        this.homeName,
        this.price,
        this.location,
        this.rating,
        this.photoUrl,
        this.description,
      ],
    );
  }

  static async  getAvgPrice() {
    const [rows] = await airbnbDb.execute('SELECT  AVG(price) AS avgPrice FROM homes');
    return rows[0].avgPrice;
  }

  static async  getAvgRating() {
    const [rows] = await airbnbDb.execute('SELECT  AVG(rating) AS avgRating FROM homes');
    return rows[0].avgRating;
  }

  async edit() {
    return airbnbDb.execute(
      "UPDATE homes SET homeName = ?, price = ?, location = ?, rating = ?, photoUrl = ?, description = ? WHERE id = ?",
      [
        this.homeName,
        this.price,
        this.location,
        this.rating,
        this.photoUrl,
        this.description,
        this.id,
      ],
    );
  }

  static async removeById(homeId) {
    return airbnbDb.execute(`DELETE FROM homes WHERE id=?`, [homeId]);
  }

  static async fetchAll() {
    return airbnbDb.execute("SELECT * FROM homes");
  }

  static async fetchById(homeId) {
    return airbnbDb.execute(`SELECT * FROM homes WHERE id=?`, [homeId]);
  }

  static async toggleIsInWishlist(homeId) {
    const [rows] = await airbnbDb.execute('SELECT isInWishlist FROM homes WHERE id = ?', [homeId]);
    if (rows.length === 0) {
        console.log("Error: Home ID not found.");
        return; 
    }
    const isInWishlist = rows[0].isInWishlist;
    let newisInWishlist;
    if(isInWishlist){
      newisInWishlist = 0;
    }else{
      newisInWishlist = 1;
    }
    await airbnbDb.execute(
      "UPDATE homes SET isInWishlist = ? WHERE id = ?",
      [
        newisInWishlist,
        homeId,
      ],
    );
  }
}

module.exports = {
  Home,
};
