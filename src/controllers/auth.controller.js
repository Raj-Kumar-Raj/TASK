import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin creation function

export const createAdmin = async (req, res) => {
  const { email, password, adminSecret } = req.body;

  // Check if the provided adminSecret is correct
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: "Invalid admin secret" });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Log the input data to debug
    console.log("Creating admin with data:", {
      email,
      password,
      role: "admin",
    });

    // Create a new user with the 'admin' role
    const adminUser = await User.create({
      email,
      password,
      role: "admin", // Explicitly set role to 'admin'
    });

    // Return the response with admin details and token
    res.status(201).json({
      _id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      token: generateToken(adminUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
