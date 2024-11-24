const Delivery = require("../models/Delivery");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

// Assign a rider and create delivery
exports.createDelivery = async (req, res) => {
  try {
    const { saleId, riderId, deliveryAddress } = req.body;

    // Validate Sale ID
    if (!mongoose.Types.ObjectId.isValid(saleId)) {
      return res.status(400).json({ error: "Invalid sale ID" });
    }

    // Fetch the sale details
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Create a new delivery
    const delivery = new Delivery({
      saleId,
      pharmacyId: sale.pharmacyId,
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
    const { deliveryId, status } = req.body;

    // Validate Delivery ID
    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      return res.status(400).json({ error: "Invalid delivery ID" });
    }

    // Update the delivery status
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    return res.status(200).json({ message: "Delivery status updated", delivery });
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
