const validator = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../utils/email-util");
const {passwordValidator, confirmPasswordValidator, userTypeValidator, emailValidator, firstNameValidator, lastNameValidator, termsValidator} =  require('../../utils/validator-util')

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
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = Date.now() + 5 * 60 * 1000;
      const user = User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        userType,
        otp,
        otpExpiry,
      });
      await user.save();
      await sendEmail(
        email,
        "Welcome to Airbnb - Verify Your Email",
        `Hi ${firstName} ${lastName},

Welcome to Airbnb! We're excited to have you join our community of travelers and hosts.

To complete your account setup, please verify your email address using the OTP (One-Time Password) below:

Your Verification Code: ${otp}

This code will expire in 5 minutes for security reasons.

Steps to verify:
1. Return to the verification page
2. Enter the 6-digit code: ${otp}
3. Click "Verify Email"

Once verified, you'll be able to:
• Browse and book unique accommodations
• Create your host profile
• Connect with our global community

If you didn't create an Airbnb account, please ignore this email.

Welcome aboard!
The Airbnb Team`,
        `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Airbnb</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #ff5a5f, #ff385c); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
        .header .subtitle { font-size: 18px; margin-top: 10px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #333; margin-bottom: 20px; font-size: 24px; }
        .content p { margin-bottom: 15px; font-size: 16px; line-height: 1.6; }
        .otp-container { background: linear-gradient(135deg, #ff5a5f, #ff385c); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .otp-label { font-size: 16px; margin-bottom: 10px; opacity: 0.9; }
        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0; }
        .expiry-notice { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; color: #856404; }
        .steps { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .steps h3 { margin-top: 0; color: #333; font-size: 18px; }
        .steps ol { margin: 0; padding-left: 20px; }
        .steps li { margin-bottom: 8px; font-size: 15px; }
        .benefits { margin: 25px 0; }
        .benefits h3 { color: #333; font-size: 18px; margin-bottom: 15px; }
        .benefits ul { margin: 0; padding-left: 20px; }
        .benefits li { margin-bottom: 8px; font-size: 15px; color: #555; }
        .footer { background-color: #f8f9fa; padding: 25px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #eee; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 30px 0; }
        .welcome-icon { font-size: 48px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏠 Airbnb</div>
            <div class="welcome-icon">🎉</div>
            <h1>Welcome ${firstName}!</h1>
            <div class="subtitle">Thanks for joining our global community</div>
        </div>
        
        <div class="content">
            <h2>Almost there! Let's verify your email</h2>
            
            <p>Hi ${firstName} ${lastName},</p>
            
            <p>We're thrilled to have you join Airbnb! To complete your account setup and ensure the security of your account, please verify your email address using the verification code below:</p>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry-notice">
                <strong>⏰ Important:</strong> This verification code will expire in <strong>5 minutes</strong> for your account security.
            </div>
            
            <div class="steps">
                <h3>📝 How to verify your email:</h3>
                <ol>
                    <li>Return to the verification page in your browser</li>
                    <li>Enter the 6-digit code: <strong>${otp}</strong></li>
                    <li>Click "Verify Email" to complete your registration</li>
                </ol>
            </div>
            
            <div class="divider"></div>
            
            <div class="benefits">
                <h3>🌟 Once verified, you'll be able to:</h3>
                <ul>
                    <li><strong>Browse & Book:</strong> Discover unique accommodations worldwide</li>
                    <li><strong>Host:</strong> Share your space and earn money</li>
                    <li><strong>Connect:</strong> Join our global community of travelers</li>
                    <li><strong>Experience:</strong> Access exclusive local experiences</li>
                </ul>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Didn't create an account?</strong></p>
            <p>If you didn't sign up for Airbnb, please ignore this email. No account will be created without verification.</p>
        </div>
        
        <div class="footer">
            <p><strong>Welcome to the Airbnb family!</strong><br>
            <em>The Airbnb Team</em></p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,
      );
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
    res.redirect(`/verify-otp?email=${email}`);
  },
];

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn: req.session.isLoggedIn,
    errorMsgs: [],
    prevDetails: {},
  });
};

module.exports = {
    getSignup,
    postSignup
}