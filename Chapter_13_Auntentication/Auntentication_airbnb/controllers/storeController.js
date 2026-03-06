const Home = require("../models/Home");
const User = require("../models/User");

const getIndex = (req, res, next) => {
  res.render("store/index", {
    pageTitle: "Airbnb",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

const getHomes = async (req, res, next) => {
  try {
    const addedHomes = await Home.find();
    const userId = req.session.user._id;
    const wishlistHomes = await User.findById(userId).populate("wishlistHomes");
    const homeIdArray = wishlistHomes.wishlistHomes.map((home) =>
      home._id.toString(),
    );
    res.render("store/homes", {
      addedHomes,
      homeIdArray,
      pageTitle: "Houses",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("Error fetching homes:", error.message);
    res.render("store/homes", {
      addedHomes: [],
      homeIdArray: [],
      pageTitle: "Houses",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

const getHomeDetails = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  try {
    const wishlistHomes = await User.findById(userId).populate("wishlistHomes");
    const homeIdArray = wishlistHomes.wishlistHomes.map((home) =>
      home._id.toString(),
    );
    const home = await Home.findById(homeId);
    res.render("store/home-details", {
      home,
      homeIdArray,
      pageTitle: "Home Details",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log(`Error fetching home with home id ${homeId}`, error.message);
    res.render("store/home-details", {
      home: undefined,
      homeIdArray: [],
      pageTitle: "Home Not Found",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const wishlistHomes = await User.findById(userId).populate("wishlistHomes");
    const wishlist = wishlistHomes.wishlistHomes.map((item) => item);
    const homeIdArray = wishlistHomes.wishlistHomes.map((home) =>
      home._id.toString(),
    );
    res.render("store/wishlist", {
      wishlist,
      homeIdArray,
      pageTitle: "Wishlist",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("Error fetching wishlist:", error.message);
    res.render("store/wishlist", {
      wishlist: [],
      homeIdArray: [],
      pageTitle: "Wishlist",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

const postAddWishlist = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const homeId = req.body._id;
    const user = await User.findOne({ _id: userId });
    if (!user.wishlistHomes.includes(homeId)) {
      user.wishlistHomes.push(homeId);
      await user.save();
    }
  } catch (error) {
    console.log(`Error adding to wishlist: ${error.message}`);
  } finally {
    res.redirect("/wishlist");
  }
};

const postRemoveWishlist = async (req, res, next) => {
  try {
    const homeId = req.body._id;
    const userId = req.session.user._id;
    const user = await User.findOne({ _id: userId });
    if (user.wishlistHomes.includes(homeId)) {
      user.wishlistHomes = user.wishlistHomes.filter((home) => home !== homeId);
      await user.save();
    }
  } catch (error) {
    console.log(`Error in removing from wishlist: ${error.message}`);
  } finally {
    res.redirect("/wishlist");
  }
};

module.exports = {
  getIndex,
  getHomeDetails,
  getHomes,
  getWishlist,
  postAddWishlist,
  postRemoveWishlist,
};
