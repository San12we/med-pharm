// controllers/drugController.js
const Drug = require('../models/Drug');

// Add a new drug to the inventory
exports.addDrug = async (req, res) => {
  try {
    const { name, category, description, price, quantity, manufacturer, expiryDate } = req.body;
    const drug = new Drug({ name, category, description, price, quantity, manufacturer, expiryDate });
    await drug.save();
    res.status(201).json({ message: 'Drug added successfully', drug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update drug details
exports.updateDrug = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const drug = await Drug.findByIdAndUpdate(id, updates, { new: true });
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }
    res.json({ message: 'Drug updated successfully', drug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all drugs
exports.getDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
