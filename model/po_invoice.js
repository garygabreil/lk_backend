const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  medicineName: { type: String },
  price: { type: String },
  quantity: { type: String },
  mrp: { type: String },
  sgst: { type: String },
  batch: { type: String },
  expiryDate: { type: String },
  total: { type: String },
  pack: { type: String },
  mid: { type: String },
  hsn_code: { type: String },
});

const poInvoiceSchema = new mongoose.Schema({
  supplierName: { type: String },
  supplierPhoneNumber: { type: String },
  supplierAddress: { type: String },
  paymentType: { type: String },
  paymentStatus: { type: String },
  items: { type: [ItemSchema] },
  grandTotalWithGST: { type: String },
  grandTotalWithOutGST: { type: String },
  total: { type: String },
  invoiceID: { type: Number, unique: true },
  invoiceDate: { type: String },
  gstAdded: { type: Boolean },
  createdBy: { type: String },
  updatedBy: { type: String },
  updatedOn: { type: String },
});

module.exports = mongoose.model("po-invoice-management", poInvoiceSchema);
