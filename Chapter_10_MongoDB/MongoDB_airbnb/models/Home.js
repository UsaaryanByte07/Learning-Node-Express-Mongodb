const { ObjectId } = require('mongodb');
const {getDb} = require('../utils/database-utils');

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
    const db = getDb();
    return await db.collection('homes').insertOne(this);
  }

  async edit(homeId) {
    const db = getDb();
    return db.collection('homes').updateOne({_id: new ObjectId(String(homeId))}, {$set: this});
  }

  static async removeById(homeId) {
    const db = getDb();
    return db.collection('homes').deleteOne({_id: new ObjectId(String(homeId))});
  }

  static async fetchAll() {
    const db = getDb();
    return db.collection('homes').find().toArray();
  }

  static async fetchById(homeId) {
    const db = getDb();
    return db.collection('homes').find({_id: new ObjectId(String(homeId))}).next()
  }
}

module.exports = {
  Home,
};
