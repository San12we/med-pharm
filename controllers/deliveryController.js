const Delivery = require("../models/Delivery");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

exports.createDelivery = async (req, res) => {
  try {
    const { saleId, riderId, deliveryAddress, pharmacyId } = req.body;

    // Log the body to ensure saleId is passed
    console.log("Request Body:", req.body);

    if (!saleId) {
      return res.status(400).json({ error: "Sale ID is required" });
    }

    const sale = await Sale.findById(saleId);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    if (sale.pharmacyId.toString() !== pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID does not match the sale's pharmacy ID" });
    }

    const delivery = new Delivery({
      saleId,
      pharmacyId,
      riderId,
      customerName: sale.customerName,
      customerContact: sale.customerContact,
      deliveryAddress,
      status: "Pending",
    });

    await delivery.save();

    return res.status(201).json({ message: "Delivery created successfully", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status, userId, userType } = req.body;

    // Validate Delivery ID
    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      return res.status(400).json({ error: "Invalid delivery ID" });
    }

    // Fetch the delivery details
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Check if the user is authorized to update the status
    if (userType === "rider" && delivery.riderId.toString() !== userId) {
      return res.status(403).json({ error: "Rider not authorized to update this delivery" });
    }

    if (userType === "pharmacy" && delivery.pharmacyId.toString() !== userId) {
      return res.status(403).json({ error: "Pharmacy not authorized to update this delivery" });
    }

    // Update the delivery status
    delivery.status = status;
    await delivery.save();

    return res.status(200).json({ message: "Delivery status updated", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all deliveries for a rider
exports.getDeliveriesByRider = async (req, res) => {
  try {
    const { riderId } = req.params;  // Extract riderId from URL params

    // Validate if riderId is provided
    if (!riderId) {
      return res.status(400).json({ error: "Rider ID is required" });
    }

    // Fetch deliveries where the riderId matches the provided riderId
    const deliveries = await Delivery.find({ riderId })
      .populate("saleId", "totalPrice")  // Populating saleId for additional details
      .populate("pharmacyId", "name");  // Optionally populate pharmacy details

    if (deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found for this rider" });
    }

    return res.status(200).json({ deliveries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all deliveries for a pharmacy
exports.getDeliveriesByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.query;

    if (!pharmacyId) {
      return res.status(400).json({ error: "Pharmacy ID is required" });
    }

    const deliveries = await Delivery.find({ pharmacyId })
      .populate("saleId", "totalPrice")
      .populate("riderId", "name");

    if (deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found for this pharmacy" });
    }

    return res.status(200).json({ deliveries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};