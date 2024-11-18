// controllers/salesController.js
const Drug = require("../models/Drug");
const Sale = require("../models/Sale");

// Record a new sale and update inventory
exports.addSale = async (req, res) => {
  try {
    const { drugId, quantitySold, customerName } = req.body;
    
    // Step 1: Find the drug and check stock
    const drug = await Drug.findById(drugId);
    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }
    
    if (drug.quantity < quantitySold) {
      return res.status(400).json({ error: "Insufficient stock available" });
    }

    // Step 2: Calculate total price
    const totalPrice = drug.price * quantitySold;

    // Step 3: Create a sale record
    const sale = new Sale({
      drugId,
      quantitySold,
      totalPrice,
      customerName,
    });
    await sale.save();

    // Step 4: Update the drug quantity in inventory
    drug.quantity -= quantitySold;
    await drug.save();

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("drugId", "name price");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
