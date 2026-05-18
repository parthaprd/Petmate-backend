const express = require("express");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// POST /api/auth/token
router.post("/token", (req, res) => {
	const { email, name } = req.body;
	if (!email || !name) {
		return res.status(400).json({ message: "Email and name are required." });
	}
	const token = generateToken({ email, name });
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	return res.status(200).json({ success: true, user: { email, name } });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	return res.status(200).json({ success: true, message: "Logged out successfully." });
});

module.exports = router;
