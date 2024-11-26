const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productImages: { type: [String], required: true },
    productDescription: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    productSize: { type: [String], required: true },
    productCategory:  { type: [String], required: true },
    productBrand: { type: String, required: true }, 
    productColor: { type: String, required: true }, 
    productGender: { type: String, enum: [String], required: true },
});

// Adding indexes for faster searching
productSchema.index({ productCategory: 1 });
productSchema.index({ productName: 1 });
productSchema.index({ productBrand: 1 }); 
productSchema.index({ productColor: 1 }); 

module.exports = mongoose.model('Product', productSchema);
