const validator = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../utils/email-util");
const crypto = require("crypto");
const {passwordValidator, confirmPasswordValidator} =  require('../../utils/validator-util')

const getForgotPassword = (req, res, next) => {
  res.render("auth/forgot-password", {
    pageTitle: "Forgot Password",
    isLoggedIn: req.session.isLoggedIn,
    errMsgs: [],
  });
};

const getResetPassword = (req, res, next) => {
  const { token, email } = req.query;
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    email,
    token,
    errMsgs: [],
    isLoggedIn: req.session.isLoggedIn,
  });
};

const postResetPassword = [
  passwordValidator,
  confirmPasswordValidator,
  async (req, res, next) => {
    const { email, token, password, confirmPassword } = req.body;
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/reset-password", {
        pageTitle: "Reset Password",
        email,
        token,
        errMsgs: errors.array(),
        isLoggedIn: req.session.isLoggedIn,
      });
    }

    try {
      const user = await User.findOne({ email });
      if (user.resetToken === token && user.resetTokenExpiry > Date.now()) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetToken = "";
        user.resetTokenExpiry = Date.now();
        await user.save();
        return res.render("auth/reset-password", {
          pageTitle: "Reset Password",
          email,
          token,
          isLoggedIn: req.session.isLoggedIn,
          errMsgs: [],
          successMsg:
            "Password has Been reset successFully you can try Sign in again",
        });
      }
      return res.render("auth/reset-password", {
        pageTitle: "Reset Password",
        email,
        token,
        isLoggedIn: req.session.isLoggedIn,
        errMsgs: ["Either the Reset Token is Invalid or Has Expired"],
      });
    } catch (err) {
      return res.render("auth/reset-password", {
        pageTitle: "Reset Password",
        email,
        token,
        isLoggedIn: req.session.isLoggedIn,
        errMsgs: ["Some Error Has Occured. Please Try Again"],
      });
    }
  },
];

const postForgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/forgot-password", {
        pageTitle: "Forgot Password",
        isLoggedIn: req.session.isLoggedIn,
        errMsgs: [
          "No user found with this email address. Please check your email and try again.",
        ],
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      "Reset Your Airbnb Password",
      `Hi there,

We received a request to reset the password for your Airbnb account associated with ${email}.

To reset your password, please click on the following link or copy and paste it into your browser:
http://localhost:3010/reset-password?token=${token}&email=${email}

This link will expire in 5 minutes for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The Airbnb Team`,
      `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #ff5a5f, #ff385c); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; }
        .content h2 { color: #333; margin-bottom: 20px; font-size: 22px; }
        .content p { margin-bottom: 15px; font-size: 16px; line-height: 1.5; }
        .button-container { text-align: center; margin: 30px 0; }
        .reset-button { display: inline-block; background: linear-gradient(135deg, #ff5a5f, #ff385c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: all 0.3s ease; }
        .reset-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 56, 92, 0.3); }
        .security-notice { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; color: #856404; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #eee; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 25px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Airbnb</div>
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello!</h2>
            
            <p>We received a request to reset the password for your Airbnb account associated with <strong>${email}</strong>.</p>
            
            <p>To create a new password, simply click the button below:</p>
            
            <div class="button-container">
                <a href="http://localhost:3010/reset-password?token=${token}&email=${email}" class="reset-button">
                    Reset My Password
                </a>
            </div>
            
            <div class="security-notice">
                <strong>⚠️ Security Notice:</strong> This link will expire in <strong>5 minutes</strong> for your account security.
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Didn't request a password reset?</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged and your account is secure.</p>
            
            <p>If you're having trouble clicking the button above, copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">
                http://localhost:3010/reset-password?token=${token}&email=${email}
            </p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>The Airbnb Team</strong></p>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,
    );

    res.render("auth/forgot-password", {
      pageTitle: "Forgot Password",
      isLoggedIn: req.session.isLoggedIn,
      successMsg: "Password reset link has been sent to your email address.",
    });
  } catch (err) {
    console.log(err);
    res.render("auth/forgot-password", {
      pageTitle: "Forgot Password",
      isLoggedIn: req.session.isLoggedIn,
      errMsgs: ["An error occurred. Please try again later."],
    });
  }
};

module.exports = {
    postForgotPassword,
    postResetPassword,
    getResetPassword,
    getForgotPassword
}