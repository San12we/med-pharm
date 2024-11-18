// controllers/saleController.js
const Sale = require("../models/Sale");
const Drug = require("../models/Drug");
const mongoose = require("mongoose");

exports.recordSale = async (req, res) => {
  try {
    const { cart, totalPrice } = req.body;

    // Iterate over each item in the cart
    for (const item of cart) {
      const { drugId, quantity, pharmacyId, customerName, customerContact } = item;

      // Log the received drugId
      console.log("Received drugId:", drugId);

      // Ensure drugId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(drugId)) {
        return res.status(400).json({ error: "Invalid drug ID" });
      }

      // Check if the drug exists
      const drug = await Drug.findById(drugId);
      if (!drug) {
        return res.status(404).json({ error: "Drug not found" });
      }

      // Check if enough stock is available
      if (drug.stock < quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      // Calculate total price for the item
      const itemTotalPrice = drug.price * quantity;

      // Create the sale
      const sale = new Sale({
        drugId,
        quantity,
        totalPrice: itemTotalPrice,
        pharmacyId,
        customerName,
        customerContact,
      });

      // Save the sale
      await sale.save();

      // Adjust stock for the drug
      drug.stock -= quantity;
      await drug.save();
    }

    return res.status(201).json({ message: "Sale recorded successfully" });
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
