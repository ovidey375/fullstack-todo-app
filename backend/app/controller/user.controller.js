import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

//Validation
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username alteast 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password alteast 6 characters long" }),
});

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(404).json({ errors: "All fields are required" });
    }

    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: "User already registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      const token = await generateTokenAndSaveInCookies(newUser._id, res);
      return res.status(201).json({
        success: true,
        message: "User register successfully",
        newUser,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ errors: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const token = await generateTokenAndSaveInCookies(user._id, res);
    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error login user" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging out user" });
  }
};
