const User = require("../../models/User");

const getVerifyOtp = (req, res, next) => {
  const email = req.query.email;
  res.render("auth/verify-otp", {
    pageTitle: "Verify OTP",
    email,
    isLoggedIn: req.session.isLoggedIn,
    errMsgs: req.flash("error") || [],
  });
};

const postVerifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.otp === otp && user.otpExpiry > Date.now()) {
      user.isVerified = true;
      user.otp = "";
      user.otpExpiry = Date.now();
      await user.save();
      res.redirect("/login");
    } else {
      res.render("auth/verify-otp", {
        pageTitle: "Verify OTP",
        email,
        isLoggedIn: req.session.isLoggedIn,
        errMsgs: ["Either the OTP has Expired or it is Invalid"],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
    getVerifyOtp,
    postVerifyOtp
}