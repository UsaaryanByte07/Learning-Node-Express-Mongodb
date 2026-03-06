const getTermsConditions = (req, res, next) => {
  res.render("legal/terms-and-conditions", {
    pageTitle: "Terms and Conditions",
    isLoggedIn: req.session.isLoggedIn,
  });
};

const getPrivacyPolicy = (req, res, next) => {
  res.render("legal/privacy-policy", {
    pageTitle: "Privacy Policy",
    isLoggedIn: req.session.isLoggedIn,
  });
};

module.exports = {
  getTermsConditions,
  getPrivacyPolicy,
};
