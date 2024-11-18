// routes/drugRoutes.js
const express = require("express");
const router = express.Router();
const drugController = require("../controllers/drugController");

// Add a new drug
router.post("/add", drugController.addDrug);

// Update a drug
router.put("/update/:id", drugController.updateDrug);

// Get all drugs (optionally filter by pharmacyId)
router.get("/", drugController.getDrugs);

module.exports = router;
