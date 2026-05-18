const express = require("express");
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// POST /api/requests (PRIVATE)
router.post("/", verifyToken, async (req, res) => {
	try {
		const { petId, petName, userName, userEmail, pickupDate, message } = req.body;
		// 1. Find the pet
		const pet = await Pet.findById(petId);
		if (!pet) return res.status(404).json({ message: "Pet not found." });
		// 2. Cannot adopt own pet
		if (pet.ownerEmail === req.user.email) {
			return res.status(403).json({ message: "You cannot adopt your own pet." });
		}
		// 3. Already adopted
		if (pet.status === "adopted") {
			return res.status(400).json({ message: "This pet has already been adopted." });
		}
		// 4. Duplicate request
		const exists = await AdoptionRequest.findOne({ petId, userEmail });
		if (exists) {
			return res.status(409).json({ message: "You have already submitted a request for this pet." });
		}
		// 5. Create request
		const request = new AdoptionRequest({
			petId,
			petName,
			userName,
			userEmail,
			pickupDate,
			message,
			status: "pending",
		});
		await request.save();
		res.status(201).json(request);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/requests/mine (PRIVATE, must be before /:id)
router.get("/mine", verifyToken, async (req, res) => {
	try {
		const requests = await AdoptionRequest.find({ userEmail: req.user.email })
			.sort({ createdAt: -1 })
			.populate({ path: "petId", select: "name imageUrl" });
		res.status(200).json(requests);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/requests/pet/:petId (PRIVATE)
router.get("/pet/:petId", verifyToken, async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.petId);
		if (!pet) return res.status(404).json({ message: "Pet not found." });
		if (pet.ownerEmail !== req.user.email) {
			return res.status(403).json({ message: "Access denied." });
		}
		const requests = await AdoptionRequest.find({ petId: req.params.petId }).sort({ createdAt: -1 });
		res.status(200).json(requests);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// PATCH /api/requests/:id (PRIVATE)
router.patch("/:id", verifyToken, async (req, res) => {
	try {
		const { status } = req.body;
		if (!status || !["approved", "rejected"].includes(status)) {
			return res.status(400).json({ message: "Invalid status value." });
		}
		const request = await AdoptionRequest.findById(req.params.id);
		if (!request) return res.status(404).json({ message: "Request not found." });
		const pet = await Pet.findById(request.petId);
		if (!pet) return res.status(404).json({ message: "Pet not found." });
		if (pet.ownerEmail !== req.user.email) {
			return res.status(403).json({ message: "Only the pet owner can update request status." });
		}
		if (["approved", "rejected"].includes(request.status)) {
			return res.status(400).json({ message: "This request has already been resolved." });
		}
		request.status = status;
		if (status === "approved") {
			pet.status = "adopted";
			await pet.save();
			await AdoptionRequest.updateMany(
				{ petId: pet._id, _id: { $ne: request._id } },
				{ $set: { status: "rejected" } }
			);
		}
		await request.save();
		res.status(200).json(request);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// DELETE /api/requests/:id (PRIVATE)
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		const request = await AdoptionRequest.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
		if (!request) {
			return res.status(404).json({ message: "Request not found or you are not the requester." });
		}
		res.status(200).json({ success: true, message: "Request cancelled successfully." });
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

module.exports = router;
