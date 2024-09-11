const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  medicineName: { type: String },
  price: { type: String },
  quantity: { type: String },
  expiryDate: { type: String },
  createdAt: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
  updatedOn: { type: String },
});

module.exports = mongoose.model("product-management", ProductSchema);
