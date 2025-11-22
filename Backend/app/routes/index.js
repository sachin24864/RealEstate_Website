import { Router } from "express";
import api from "./api/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as UserServices from "../services/user.js";
import { comparePassword, hashPassword } from "../middleware/hashPassword.js";
import checkauth from "../middleware/Checkauth.js";
import { role } from "../constants/index.js";
import { sendPasswordResetEmail } from "../libs/communication.js"; 

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const router = Router();

router.use("/api", api);

/**
 * LOGIN ROUTE
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserServices.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * FORGET PASSWORD ROUTE
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserServices.findOne({ email, role: role.admin });
    if (!user) {
      return res.status(404).json({ message: "Admin user with this email not found" });
    }

    const newPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await hashPassword(newPassword);

    await UserServices.updateOne({ _id: user._id }, { password: hashedPassword });

    await sendPasswordResetEmail(user.email, newPassword);

    return res.json({ message: "A new password has been sent to the admin's email address." });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * LOGOUT ROUTE
 */
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * CHECK AUTHENTICATION ROUTE
 */
router.get("/check-auth", checkauth, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

export default router;
