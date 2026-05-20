
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
const allowedOrigins = process.env.CLIENT_URL
	? process.env.CLIENT_URL.split(",")
	: ["http://localhost:3000"];

// Add the frontend vercel URL to allowed origins
allowedOrigins.push("https://petmate-frontend-nd8w.vercel.app");

app.use(
	cors({
		origin: allowedOrigins,
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

// Middleware to ensure DB connection
let dbConnected = false;
app.use(async (req, res, next) => {
	if (!dbConnected) {
		try {
			await connectDB();
			dbConnected = true;
			console.log("Database connection established");
		} catch (err) {
			console.error("Failed to connect to database:", err);
			return res.status(500).json({ message: "Database connection failed" });
		}
	}
	next();
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/requests", requestRoutes);

// Global error handler
app.use((err, req, res, next) => {
	console.error("Error:", err.message);
	console.error("Stack:", err.stack);
	res.status(500).json({ message: "Internal server error.", error: err.message });
});

// Export for Vercel serverless
module.exports = app;

// Start server locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 5000;
	connectDB().then(() => {
		dbConnected = true;
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
}
