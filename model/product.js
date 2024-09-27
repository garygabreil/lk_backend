const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  medicineName: { type: String },
  batch: { type: String },
  expiryDate: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  sgst: { type: Number },
  hsn_code: { type: String },
  createdAt: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
  updatedOn: { type: String },
  mid: { type: String },
});

module.exports = mongoose.model("medicine-management", ProductSchema);
