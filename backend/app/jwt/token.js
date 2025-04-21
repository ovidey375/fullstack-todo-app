import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    await User.findByIdAndUpdate(userId, { token });
    return token;
  } catch (error) {
    console.log(error);
  }
};


