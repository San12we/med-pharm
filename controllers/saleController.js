const Sale = require("../models/Sale");
const Drug = require("../models/Drug");
const Delivery = require("../models/Delivery");
const mongoose = require("mongoose");

// Record a sale and create a delivery
exports.recordSale = async (req, res) => {
  try {
    const { cart, totalPrice, deliveryAddress, riderId } = req.body;

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

      // Create a delivery record
      const delivery = new Delivery({
        saleId: sale._id,
        pharmacyId,
        riderId,
        customerName,
        customerContact,
        deliveryAddress,
        status: "Pending",
      });

      await delivery.save();
    }

    return res.status(201).json({ message: "Sale and delivery recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales and related deliveries for a specific pharmacy
exports.getSalesByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.query;

    if (!pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID is required" });
    }

    // Fetch sales and populate drug and related delivery details
    const sales = await Sale.find({ pharmacyId })
      .populate("drugId", "name price")
      .populate({
        path: "delivery",
        select: "status deliveryAddress riderId",
        populate: {
          path: "riderId",
          select: "name contact",
        },
      });

    if (sales.length === 0) {
      return res.status(404).json({ message: "No sales found for this pharmacy" });
    }

    return res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
