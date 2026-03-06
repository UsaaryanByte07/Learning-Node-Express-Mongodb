const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false,
  });
};

const postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  //Don't use async await as it doesn't returns a promise by default..
  req.session.save((err) => {
    if (err) {
      console.log("Session Save error:", err);
      return res.redirect("/login");
    }
    res.redirect("/");
  });
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
  postLogout,
};
