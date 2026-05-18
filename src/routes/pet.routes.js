const express = require("express");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// GET /api/pets/featured (must be before /:id)
router.get("/featured", async (req, res) => {
	try {
		const pets = await Pet.find({ status: "available" })
			.sort({ createdAt: -1 })
			.limit(6)
			.select("-__v");
		res.status(200).json(pets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets/owner/listings (private, must be before /:id)
router.get("/owner/listings", verifyToken, async (req, res) => {
	try {
		const pets = await Pet.find({ ownerEmail: req.user.email })
			.sort({ createdAt: -1 });
		res.status(200).json(pets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets (public)
router.get("/", async (req, res) => {
	try {
		const { search, species, sort } = req.query;
		const filter = {};
		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}
		if (species) {
			filter.species = { $in: species.split(",") };
		}
		let query = Pet.find(filter).select("-__v");
		if (sort === "asc") query = query.sort({ adoptionFee: 1 });
		else if (sort === "desc") query = query.sort({ adoptionFee: -1 });
		const pets = await query;
		res.status(200).json(pets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets/:id (public)
router.get("/:id", async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id).select("-__v");
		if (!pet) return res.status(404).json({ message: "Pet not found." });
		res.status(200).json(pet);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// POST /api/pets (private)
router.post("/", verifyToken, async (req, res) => {
	try {
		const {
			name,
			species,
			breed,
			age,
			gender,
			imageUrl,
			healthStatus,
			vaccinationStatus,
			location,
			adoptionFee,
			description,
		} = req.body;
		const pet = new Pet({
			name,
			species,
			breed,
			age,
			gender,
			imageUrl,
			healthStatus,
			vaccinationStatus,
			location,
			adoptionFee,
			description,
			ownerEmail: req.user.email,
		});
		await pet.save();
		res.status(201).json(pet);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// PUT /api/pets/:id (private)
router.put("/:id", verifyToken, async (req, res) => {
	try {
		const pet = await Pet.findOne({ _id: req.params.id, ownerEmail: req.user.email });
		if (!pet) {
			return res.status(404).json({ message: "Pet not found or you are not the owner." });
		}
		// Only allow updatable fields
		const updatableFields = [
			"name",
			"species",
			"breed",
			"age",
			"gender",
			"imageUrl",
			"healthStatus",
			"vaccinationStatus",
			"location",
			"adoptionFee",
			"description",
		];
		updatableFields.forEach((field) => {
			if (req.body[field] !== undefined) pet[field] = req.body[field];
		});
		await pet.save();
		res.status(200).json(pet);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// DELETE /api/pets/:id (private)
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		const pet = await Pet.findOneAndDelete({ _id: req.params.id, ownerEmail: req.user.email });
		if (!pet) {
			return res.status(404).json({ message: "Pet not found or you are not the owner." });
		}
		res.status(200).json({ success: true, message: "Pet deleted successfully." });
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

module.exports = router;
