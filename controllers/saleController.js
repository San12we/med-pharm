// controllers/saleController.js
const Sale = require("../models/Sale");
const Drug = require("../models/Drug");

exports.recordSale = async (req, res) => {
  try {
    const { drugId, quantity, pharmacyId, customerName, customerContact } = req.body;

    // Check if the drug exists
    const drug = await Drug.findById(drugId);
    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }

    // Check if enough stock is available
    if (drug.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Calculate total price
    const totalPrice = drug.price * quantity;

    // Create the sale
    const sale = new Sale({
      drugId,
      quantity,
      totalPrice,
      pharmacyId,
      customerName,
      customerContact,
    });

    // Save the sale
    await sale.save();

    // Adjust stock for the drug
    drug.stock -= quantity;
    await drug.save();

    return res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales for a specific pharmacy
exports.getSalesByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.query;

    if (!pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID is required" });
    }

    const sales = await Sale.find({ pharmacyId }).populate("drugId", "name price");

    if (sales.length === 0) {
      return res.status(404).json({ message: "No sales found for this pharmacy" });
    }

    return res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};