// routes/drugRoutes.js
const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drugController');

// Define routes for drug operations
router.post('/add', drugController.addDrug);
router.put('/update/:id', drugController.updateDrug);
router.get('/', drugController.getDrugs);

module.exports = router;  // Make sure to export the router
