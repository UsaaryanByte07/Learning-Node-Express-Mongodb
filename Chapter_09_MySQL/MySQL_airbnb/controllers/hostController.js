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
    const [addedHomes] = await Home.fetchAll();
    const avgPrice = await Home.getAvgPrice();
    const avgRating = await Home.getAvgRating();
    res.render("host/host-homes", { addedHomes, pageTitle: "Host Houses" ,avgPrice, avgRating });
  } catch (error) {
    console.log("Error fetching homes:", error.message);
    res.render("host/host-homes", { addedHomes: [], pageTitle: "Host Houses" ,avgPrice: "Error", avgRating: "Error"});
  }
};

const getEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const isEditing = req.query.isEditing === "true"; //As req.query.isEditing will give a string but we need a boolean
  
  if (!isEditing) {
    console.log("Editing flag not set properly");
    return res.redirect("/host/host-homes");
  }
  
  try {
    const [homes] = await Home.fetchById(homeId);
    const home = homes[0];
    if (!home) {
      console.log(`Home with ID ${homeId} not found`);
      return res.redirect("/host/host-homes");
    }
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
    const { homeName, price, location, rating, photoUrl, description } = req.body;
    const newHome = new Home(homeName, price, location, rating, photoUrl, description);
    await newHome.save();
    res.render("host/home-added", { pageTitle: "Home Added" });
  } catch (error) {
    console.log("Error Occurred while Writing the Data:", error.message);
    res.render("host/edit-or-add-home", {
      isEditing: false,
      pageTitle: "Add Home",
      error: "Failed to add home. Please try again.",
      formData: req.body
    });
  }
};

const postEditHome = async (req, res, next) => {
  try {
    const { homeName, price, location, rating, photoUrl, id, description } = req.body;
    const updatedHome = new Home(homeName, price, location, rating, photoUrl, description);
    updatedHome.id = id;
    await updatedHome.edit();
    res.redirect("/host/host-homes");
  } catch (error) {
    console.log("Error Occurred while updating the Data:", error.message);
    res.redirect("/host/host-homes");
  }
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
