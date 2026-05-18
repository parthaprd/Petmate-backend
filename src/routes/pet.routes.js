const express = require("express");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// GET /api/pets/featured (must be before /:id)
router.get("/featured", async (req, res) => {
	try {
		const pets = await Pet.findByStatus("available");
		// Sort by createdAt and limit to 6
		const sortedPets = pets
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 6);
		res.status(200).json(sortedPets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets/owner/listings (private, must be before /:id)
router.get("/owner/listings", verifyToken, async (req, res) => {
	try {
		const pets = await Pet.findByOwnerEmail(req.user.email);
		const sortedPets = pets.sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);
		res.status(200).json(sortedPets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets (public)
router.get("/", async (req, res) => {
	try {
		const { search, species, sort } = req.query;
		let pets = await Pet.findAll();

		// Apply filters
		if (search) {
			pets = pets.filter((pet) =>
				pet.name.toLowerCase().includes(search.toLowerCase())
			);
		}
		if (species) {
			const speciesArray = species.split(",");
			pets = pets.filter((pet) => speciesArray.includes(pet.species));
		}

		// Apply sorting
		if (sort === "asc") {
			pets = pets.sort((a, b) => a.adoptionFee - b.adoptionFee);
		} else if (sort === "desc") {
			pets = pets.sort((a, b) => b.adoptionFee - a.adoptionFee);
		}

		res.status(200).json(pets);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// GET /api/pets/:id (public)
router.get("/:id", async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);
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

		const petData = {
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
		};

		const pet = await Pet.create(petData);
		res.status(201).json(pet);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// PUT /api/pets/:id (private)
router.put("/:id", verifyToken, async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);
		if (!pet || pet.ownerEmail !== req.user.email) {
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

		const updateData = {};
		updatableFields.forEach((field) => {
			if (req.body[field] !== undefined) updateData[field] = req.body[field];
		});

		await Pet.updateOne(req.params.id, updateData);
		const updatedPet = await Pet.findById(req.params.id);
		res.status(200).json(updatedPet);
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

// DELETE /api/pets/:id (private)
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);
		if (!pet || pet.ownerEmail !== req.user.email) {
			return res.status(404).json({ message: "Pet not found or you are not the owner." });
		}

		await Pet.deleteOne(req.params.id);
		res.status(200).json({ success: true, message: "Pet deleted successfully." });
	} catch (err) {
		res.status(500).json({ message: "Internal server error." });
	}
});

module.exports = router;
