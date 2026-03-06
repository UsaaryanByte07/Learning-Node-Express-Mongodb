const validator = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: req.session.isLoggedIn,
    errMsgs: [],
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn: req.session.isLoggedIn,
    errorMsgs: [],
    prevDetails: {},
  });
};

const postLogin = async (req, res, next) => {
  const { email, password} = req.body;
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

const firstNameValidator = validator
  .check("firstName")
  .notEmpty()
  .withMessage("First Name is Required")
  .trim()
  .isLength({ min: 2 })
  .withMessage("First name should be least 2 Characters Long")
  .matches(/^[a-zA-Z]+$/)
  .withMessage("First Name can only Contain English Alphabets");

const lastNameValidator = validator
  .check("lastName")
  .notEmpty()
  .withMessage("Last Name is Required")
  .trim()
  .isLength({ min: 2 })
  .withMessage("Last name should be least 2 Characters Long")
  .matches(/^[a-zA-Z]+$/)
  .withMessage("Last Name can only Contain English Alphabets");

const emailValidator = validator
  .check("email")
  .notEmpty()
  .withMessage("Email is Required")
  .trim()
  .isEmail()
  .withMessage("Please provide a valid Email Address")
  .normalizeEmail();

const passwordValidator = validator
  .check("password")
  .notEmpty()
  .withMessage("Password is Required")
  .isLength({ min: 8 })
  .withMessage("Password should be at least 8 Characters Long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage(
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  );

const confirmPasswordValidator = validator
  .check("confirmPassword")
  .notEmpty()
  .withMessage("Confirm Password is Required")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm Password does not match Password");
    }
    return true;
  });

const userTypeValidator = validator
  .check("userType")
  .notEmpty()
  .withMessage("User Type is Required")
  .isIn(["host", "customer"])
  .withMessage("User Type must be either Host or Customer");

const termsValidator = validator
  .check("terms")
  .notEmpty()
  .withMessage("You must accept Terms and Conditions");

const postSignup = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  termsValidator,
  async (req, res, next) => {
    const {
      firstName,
      lastName,
      password,
      email,
      confirmPassword,
      userType,
      terms,
    } = req.body;
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        errorMsgs: errors.array(),
        prevDetails: {
          firstName,
          lastName,
          password,
          email,
          confirmPassword,
          userType,
          terms,
        },
        isLoggedIn: req.session.isLoggedIn,
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        userType,
      });
      await user.save();
    } catch (err) {
      if (err.code == 11000) {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          errorMsgs: [
            {
              msg: "Email Entered by You already Exist. You can Try Sign In with the Email.",
            },
          ],
          prevDetails: {
            firstName,
            lastName,
            password,
            email,
            confirmPassword,
            userType,
            terms,
          },
          isLoggedIn: req.session.isLoggedIn,
        });
      }
      return res.status(500).render("auth/signup", {
        pageTitle: "Signup",
        errorMsgs: [
          { msg: "An unexpected server error occurred. Please try again." },
        ],
        prevDetails: {
          firstName,
          lastName,
          email,
          confirmPassword,
          userType,
          terms,
        },
        isLoggedIn: req.session.isLoggedIn,
      });
    }
    res.redirect("/login");
  },
];

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
  getSignup,
  postSignup,
};
