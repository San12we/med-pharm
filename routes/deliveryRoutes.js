const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

// Create delivery
router.post("/create", deliveryController.createDelivery);

// Update delivery status
router.put("/update-status", deliveryController.updateDeliveryStatus);

// Get all deliveries for a pharmacy
router.get("/pharmacy", deliveryController.getDeliveriesByPharmacy);

module.exports = router;
