const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productImage: { type: String, required: true },
    productDescription: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    productSize: { type: [String], required: true },
    productCategory: { type: String, required: true }, // added productCategory field
});

// Adding indexes for faster searching
productSchema.index({ productCategory: 1 });
productSchema.index({ productName: 1 });

module.exports = mongoose.model('Product', productSchema);
