// routes/saleRoutes.js
const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// Record a sale
router.post("/record", saleController.recordSale);

// Get all sales for a specific pharmacy
router.get("/", saleController.getSalesByPharmacy);

module.exports = router;
