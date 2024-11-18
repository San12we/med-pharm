const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be greater than zero'] // Ensure price is positive
    },
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    category: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    restockLevel: {
        type: Number,
        default: 10
    },
    sales: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            quantity: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

// Adjust the stock and handle negative stock values if needed
drugSchema.methods.adjustStock = function (quantity) {
    if (quantity < 0 && this.stock + quantity < 0) {
        throw new Error('Not enough stock to adjust');
    }
    this.stock += quantity;

    // Trigger a restock notification if stock goes below the restock level
    if (this.stock < this.restockLevel) {
        console.log(`Stock for ${this.name} is below restock level. Consider restocking.`);
    }

    return this.save();
};

// Record a sale and adjust stock accordingly
drugSchema.methods.recordSale = function (quantity, totalPrice) {
    if (this.stock < quantity) {
        throw new Error('Not enough stock to complete the sale');
    }

    this.sales.push({ quantity, totalPrice });
    this.stock -= quantity;

    return this.save();
};

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
