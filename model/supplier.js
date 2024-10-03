const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierName: { type: String },
  supplierAddress: { type: String },
  supplierPhone: { type: String },
  pid: { type: String },
});

module.exports = mongoose.model("supplier-management", SupplierSchema);
