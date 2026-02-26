const { Home } = require("../models/Home");
const { Wishlist } = require("../models/Wishlist");

const getAddHome = (req, res, next) => {
  res.render("host/edit-or-add-home", {
    isEditing: false,
    pageTitle: "Add Home",
  });
};

const getHostHomes = async (req, res, next) => {
  try {
    const addedHomes = await Home.fetchAll();
    res.render("host/host-homes", { addedHomes, pageTitle: "Host Houses" });
  } catch (error) {
    console.log("Error fetching homes:", error.message);
    res.render("host/host-homes", { addedHomes: [], pageTitle: "Host Houses" });
  }
};

const getEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const isEditing = req.query.isEditing === "true"; //As req.query.isEditing will give a string but we need a boolean
  try {
    if (!isEditing) {
      res.redirect("/host/host-homes");
      throw new Error("Editing flag not set properly");
    }
  } catch (err) {
    console.log(`${err.message}`);
    return;
  }
  try {
    const home = await Home.fetchById(homeId);
    res.render("host/edit-or-add-home", {
      isEditing: isEditing,
      pageTitle: "Edit Home",
      home,
    });
  } catch (err) {
    console.log(`Error Occurred while getting Edit home Page: ${err.message}`);
    return res.redirect("/host/host-homes");
  }
};

const postAddHome = async (req, res, next) => {
  try {
    const { homeName, price, location, rating, photoUrl } = req.body;
    const newHome = new Home(homeName, price, location, rating, photoUrl);
    await newHome.save();
    res.render("host/home-added", { pageTitle: "Home Added" });
  } catch (error) {
    console.log("Error Occurred while Writing the Data:", error.message);
  }
};

const postEditHome = async (req, res, next) => {
  try {
    const { homeName, price, location, rating, photoUrl, id } = req.body;
    const newHome = new Home(homeName, price, location, rating, photoUrl);
    newHome.id = id;
    await newHome.edit();
  } catch (error) {
    console.log("Error Occurred while Writing the Data:", error.message);
  }
  res.redirect("/host/host-homes");
};

const postDeleteHome = async (req, res, next) => {
    try{
        const homeId = req.params.homeId;
        await Home.removeById(homeId);
        await Wishlist.removeFromWishlist(homeId);
    }catch(err){
        console.log(`${err.message}`);
    }
    res.redirect("/host/host-homes");
}

module.exports = {
  getAddHome,
  postAddHome,
  getHostHomes,
  getEditHome,
  postEditHome,
  postDeleteHome,
};
