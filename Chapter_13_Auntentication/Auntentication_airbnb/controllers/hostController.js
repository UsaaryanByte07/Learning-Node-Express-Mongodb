const Home = require("../models/Home");

const getAddHome = (req, res, next) => {
  res.render("host/edit-or-add-home", {
    isEditing: false,
    pageTitle: "Add Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

const getHostHomes = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const addedHomes = await Home.find({host: userId});
    res.render("host/host-homes", { addedHomes, pageTitle: "Host Houses", isLoggedIn: req.session.isLoggedIn, user: req.session.user});
  } catch (error) {
    console.log("Error fetching homes:", error.message);
    res.render("host/host-homes", { addedHomes: [], pageTitle: "Host Houses", isLoggedIn: req.session.isLoggedIn, user: req.session.user});
  }
};

const getEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const isEditing = req.query.isEditing === "true"; //As req.query.isEditing will give a string but we need a boolean
  try {
    if (!isEditing) {
      return res.redirect("/host/host-homes");
    }
  } catch (err) {
    console.log(`${err.message}`);
    return;
  }
  try {
    const home = await Home.findById(homeId);
    res.render("host/edit-or-add-home", {
      isEditing: isEditing,
      pageTitle: "Edit Home",
      home,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(`Error Occurred while getting Edit home Page: ${err.message}`);
    return res.redirect("/host/host-homes");
  }
};

const postAddHome = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const { homeName, price, location, rating, photoUrl, description } = req.body;
    const newHome = new Home({homeName, price, location, rating, photoUrl, description, host: userId});
    await newHome.save();
    res.render("host/home-added", { pageTitle: "Home Added", isLoggedIn: req.session.isLoggedIn , user: req.session.user});
  } catch (error) {
    console.log("Error Occurred while Writing the Data:", error.message);
    res.render("host/edit-or-add-home", {
    isEditing: false,
    pageTitle: "Add Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    errorMsgs: ["Error Occurred while Adding Home. Please Try Again."],
  });
  }
};

const postEditHome = async (req, res, next) => {
  try {
    const { homeName, price, location, rating, photoUrl, _id, description } = req.body;
    await Home.findOneAndUpdate({ _id, host: req.session.user._id }, {homeName, price, location, rating, photoUrl, description});
  } catch (error) {
    console.log("Error Occurred while Writing the Data:", error.message);
  }
  res.redirect("/host/host-homes");
};

const postDeleteHome = async (req, res, next) => {
    try{
        const homeId = req.params.homeId;
        await Home.findOneAndDelete({ _id: homeId, host: req.session.user._id });
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
