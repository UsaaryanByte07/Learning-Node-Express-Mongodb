const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: req.session.isLoggedIn,
    errMsgs: [],
  });
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.render("auth/login", {
        pageTitle: "Login",
        errMsgs: [
          "Either the Email is incorrect or the Password",
          "Please Check the Password and Email and try again",
        ],
        isLoggedIn: req.session.isLoggedIn,
      });
    }

    if (!user.isVerified) {
      req.flash("error", "Please Verify your Email First");
      return res.redirect(`/verify-otp?email=${email}`);
    }
    // Compare password (bcrypt.compare is async, so we need await)
    const isMatching = await bcrypt.compare(password, user.password);

    if (isMatching) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // Save session and redirect after successful save
      req.session.save((err) => {
        if (err) {
          console.log("Session Save error:", err);
          return res.render("auth/login", {
            pageTitle: "Login",
            errMsgs: ["Some Error Occured at Server Side", " Please Try Again"],
            isLoggedIn: req.session.isLoggedIn,
          });
        }
        // Redirect only after session is successfully saved
        res.redirect("/");
      });
    } else {
      return res.render("auth/login", {
        pageTitle: "Login",
        errMsgs: [
          "Either the Email is incorrect or the Password",
          "Please Check the Password and Email and try again",
        ],
        isLoggedIn: req.session.isLoggedIn,
      });
    }
  } catch (err) {
    console.log("Login error:", err);
    return res.render("auth/login", {
      pageTitle: "Login",
      errMsgs: [
        "Either the Email is incorrect or the Password",
        "Please Check the Password and Email and try again",
      ],
      isLoggedIn: req.session.isLoggedIn,
    });
  }
};

const postLogout = (req, res, next) => {
  //Don't use async await as it doesn't returns a promise by default..
  req.session.destroy((err) => {
    if (err) {
      console.log("Session Destroy error:", err);
    }
    // Clear the session cookie from browser
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
    });
    res.redirect("/");
  });
};

module.exports = {
    getLogin,
    postLogin,
    postLogout
}