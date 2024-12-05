const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

// Create delivery
router.post("/create", deliveryController.createDelivery);

// Update delivery status
router.put("/update-status", deliveryController.updateDeliveryStatus);

// Get all deliveries for a pharmacy
router.get("/pharmacy", deliveryController.getDeliveriesByPharmacy);

// Get all deliveries by a rider
router.get("/rider/:riderId", deliveryController.getDeliveriesByRider);

module.exports = router;

