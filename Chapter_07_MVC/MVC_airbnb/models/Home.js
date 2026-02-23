const fs = require('fs').promises  // Use promises version of fs whenever using promises or async-await
const path = require('path')
const rootDir = require('../utils/path-util')

const homeFilePath = path.join(rootDir,'data','home.json')

class Home {
    constructor(homeName, price, location, rating, photoUrl){
        this.homeName = homeName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
    }

    async save(){
        try {
            const addedHomes = await Home.fetchAll();
            addedHomes.push(this);
            await fs.writeFile(homeFilePath, JSON.stringify(addedHomes));
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to save home: ${error.message}`);
        }
    }

    static async fetchAll(){
        try {
            const data = await fs.readFile(homeFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

module.exports = {
    Home,
}