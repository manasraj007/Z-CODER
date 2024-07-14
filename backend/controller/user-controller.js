import {
  generateAccessTokenUtils,
  generateRefreshTokenUtils,
  otpGeneratorAndMailer,
  mailUtil,
} from "../utils.js";
import { User } from "../model/user.js";
import { OTPVerify } from "../model/otpverification.js";

export async function Signup(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const techStack = req.body.techStack;
  const language = req.body.language;
  const codeforces = req.body.codeforces;
  const codechef = req.body.codechef;
  const leetcode = req.body.leetcode;
  if (email === undefined || username === undefined || password === undefined) {
    return res.status(400).json({
      error: true,
      message: "all required fields are not sent",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: true,
      message: "Password must have at least 8 characters",
    });
  }

  [techStack, language, codeforces, codechef, leetcode].map((item) => {
    if (item === "" || item === null) item = " ";
  });

  const userExistenceCheck = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (
    !(userExistenceCheck === null) &&
    (userExistenceCheck.email == email ||
      userExistenceCheck.username == username)
  ) {
    return res.status(400).json({
      error: true,
      message:
        "User with same Email or username already exist! Choose a different one",
    });
  }

  const newUser = await User.create({
    username,
    email,
    password,
    techStack,
    language,
    codeforces,
    codechef,
    leetcode,
    verfied: false,
    online: false,
  });
  if (newUser === null) {
    return res.status(505).json({
      error: true,
      message: "New User not Created due to Server Error",
    });
  }

  mailUtil(email, "Welcome to ZCODER!!");
  return res.status(200).json({
    user: newUser,
    error_status: false,
    message: "Succesfully created account. GO LOG IN!!!!",
  });
}
export async function OTPver(req, res) {
  try {
    let user = req.user;
    user = await User.findById(user._id);
    if (user.verfied) {
      return res.status(401).json({
        error: true,
        message: "User is Already Verified",
      });
    }
    const clearExpiredOTP = await OTPVerify.deleteMany({
      expiresIn: { $lte: Date.now() },
    });
    const otp = await otpGeneratorAndMailer(user.email);
    if (otp === false) {
      throw new Error("otp not generated");
    }

    const OTPCheck = await OTPVerify.findOne({ userId: user._id });
    if (OTPCheck !== null) {
      return res.status(404).json({
        error: true,
        message:
          "Too Early to make another OTP request! You must wait for 15minutes between making two successive OTP requests",
      });
    }
    const NewOTP = await OTPVerify.create({
      userId: user._id,
      otp: otp,
      expiresIn: Date.now() + 15 * 60 * 1000,
    });
    mailUtil(user.email, `Your OTP for ZCoder account id ${otp}`);
    return res.status(200).json({
      error: false,
      message:
        "OTP sent to your Registered Email Id. Do not make furthur OTP request for 15minutes",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Could Not generate and send OTP",
    });
  }
}
export async function OTPfinal(req, res) {
  try {
    let user = req.user;
    const otp = req.body.otp;
    user = await User.findById(user._id);

    if (!otp) {
      return res.status(400).json({
        error: true,
        message: "OTP not entered",
      });
    }

    const OTPCheck = await OTPVerify.findOne({ userId: user._id });
    if (!OTPCheck) {
      return res.status(400).json({
        error: true,
        message: "OTP request was not made!",
      });
    }

    if (OTPCheck.expiresIn <= Date.now()) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(400).json({
        error: true,
        message: "OTP request Timed out",
      });
    }

    const OTPVerificationCheck = await OTPCheck.isOTPCorrect(otp);
    if (!OTPVerificationCheck) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(401).json({
        error: true,
        message: "OTP Incorrect",
      });
    }

    user.verfied = true;
    user.save({ validateBeforSave: false });
    await OTPVerify.deleteOne({ userId: user._id });
    return res.status(200).json({
      error: false,
      message: "Email Verification Successfull",
    });
  } catch (error) {
    return res.status(501).json({
      error: true,
      message: "Server Error Occured",
    });
  }
}
export async function Login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const userExistenceCheck = await User.findOne({ username: username });
    if (!userExistenceCheck) {
      return res.status(400).json({
        loggedInUser: null,
        error: true,
        message: "User Does not Exist!! Give a Valid Username",
      });
    }
    const user = userExistenceCheck;
    const passwordCheck = await user.isPasswordCorrect(password);
    if (!passwordCheck) {
      mailUtil(
        user.email,
        "ALERT!!!Someone tried to Enter in yor ZCoder Account with a incorrect or invalid Password!!"
      );
      return res.status(400).json({
        loggedInUser: null,
        error: true,
        message: "Incorrect Password",
      });
    }
    const AccessToken = await generateAccessTokenUtils(user._id);
    const RefreshToken = await generateRefreshTokenUtils(user._id);

    if (!AccessToken || !RefreshToken) {
      return res.status(501).json({
        user: null,
        error: true,
        message: "Error in Generating Bearer Tokens",
      });
    }

    const loggedInUser = await User.findById(user._id).select(
      " -password -refreshToken"
    );
    const options = {
      // httpOnly:true,
      // secure:true
    };
    loggedInUser.online = true;
    loggedInUser.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie("AccessToken", AccessToken, options)
      .cookie("RefreshToken", RefreshToken, options)
      .json({
        error: false,
        loggedInUser: loggedInUser,
        AccessToken: AccessToken,
        RefreshToken: RefreshToken,
        message: "Succesfull Login",
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some Error Occured",
    });
  }
}
export async function ForgotPassword(req, res) {
  try {
    const username = req.body.username;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "username does not exist",
      });
    }
    const clearExpiredOTP = await OTPVerify.deleteMany({
      expiresIn: { $lte: Date.now() },
    });
    if (!user.verfied) {
      return res.status(401).json({
        error: true,
        message:
          "You cannot retrieve your password since your registered email is not verified",
      });
    }

    const otp = await otpGeneratorAndMailer(user.email);
    if (otp === false) {
      throw new Error();
    }

    const OTPCheck = await OTPVerify.findOne({ userId: user._id });
    if (OTPCheck !== null) {
      return res.status(404).json({
        error: true,
        message:
          "Too Early to make another OTP request! You must wait for 15minutes between making two successive OTP requests",
      });
    }
    const NewOTP = await OTPVerify.create({
      userId: user._id,
      otp: otp,
      expiresIn: Date.now() + 11 * 60 * 1000,
    });
    mailUtil(
      user.email,
      `Your OTP for ZCoder account password retrieval id ${otp}`
    );
    return res.status(200).json({
      error: false,
      message: `OTP sent to your registered email address`,
    });
  } catch (error) {
    return res.status(501).json({
      error: true,
      message: "Server error occured",
    });
  }
}
export async function ResetPassword(req, res) {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(400).json({
        error: true,
        message: "No email header available",
      });
    }
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;
    const user = await User.findOne({ username: username });

    if (!otp) {
      return res.status(400).json({
        error: true,
        message: "OTP not entered",
      });
    }

    const OTPCheck = await OTPVerify.findOne({ userId: user._id });
    if (!OTPCheck) {
      return res.status(400).json({
        error: true,
        message: "OTP request was not made!",
      });
    }

    if (OTPCheck.expiresIn <= Date.now()) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(400).json({
        error: true,
        message: "OTP request Timed out",
      });
    }

    const OTPVerificationCheck = await OTPCheck.isOTPCorrect(otp);
    if (!OTPVerificationCheck) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(401).json({
        error: true,
        message: "OTP Incorrect",
      });
    }

    await OTPVerify.deleteOne({ userId: user._id });
    user.password = newPassword;
    user.save({ validateBeforeSave: false });
    mailUtil(user.email, "Your ZCoder Password is reset successfully");
    return res.status(200).json({
      error: false,
      message: "Password Reset Successfull",
    });
  } catch (error) {
    return res.status(501).json({
      error: true,
      message: "Server Error Occured",
    });
  }
}
export async function Logout(req, res) {
  try {
    let user = req.user;
    user = await User.findById(user._id);
    user.online = false;
    user.refreshToken = undefined;
    await user.save({ validateBeforSave: false });
    const options = {
      httpOnly: true,
      // secure:true
    };

    return res
      .status(200)
      .clearCookie("AccessToken", options)
      .clearCookie("RefreshToken", options)
      .json({
        error: false,
        message: "User Logged Out Successfully",
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Error in Server while logging Out the user",
    });
  }
}
