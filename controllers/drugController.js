// controllers/drugController.js
const Drug = require("../models/Drug");

exports.addDrug = async (req, res) => {
  try {
    const { name, category, description, price, quantity, manufacturer, expiryDate, pharmacyId } = req.body;

    // Check if pharmacyId is provided
    if (!pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID is required" });
    }

    const drug = new Drug({
      name,
      category,
      description,
      price,
      quantity,
      manufacturer,
      expiryDate,
      pharmacyId,
    });

    await drug.save();
    res.status(201).json({ message: "Drug added successfully", drug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Drug Route (with pharmacyId)
exports.updateDrug = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure pharmacyId is not being updated directly (if needed)
    if (updates.pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID cannot be updated directly" });
    }

    const drug = await Drug.findByIdAndUpdate(id, updates, { new: true });
    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }

    res.json({ message: "Drug updated successfully", drug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDrugs = async (req, res) => {
  try {
    const pharmacyId = req.query.pharmacyId; // Get pharmacyId from query params

    if (!pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID is required" });
    }

    // Find drugs for the given pharmacyId
    const drugs = await Drug.find({ pharmacyId });

    if (drugs.length === 0) {
      return res.status(404).json({ message: "No drugs found for this pharmacy" });
    }

    return res.status(200).json({ drugs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};