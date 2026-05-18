
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, closeDB } = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const petRoutes = require("./src/routes/pet.routes");
const requestRoutes = require("./src/routes/request.routes");

const app = express();

// CORS configuration
app.use(
	cors({
		origin: process.env.CLIENT_URL.split(","),
		credentials: true,
	})
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
	res.json({ status: "Pet Adoption API is running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/requests", requestRoutes);

// Global error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal server error." });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});

	// Graceful shutdown
	process.on("SIGINT", async () => {
		console.log("Shutting down gracefully...");
		await closeDB();
		process.exit(0);
	});
});
