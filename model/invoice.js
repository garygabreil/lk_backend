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
});

const invoiceSchema = new mongoose.Schema({
  // billingInfo: { type: BillingInfoSchema },
  // patientInfo: { type: PatientInfoSchema },
  patientName: { type: String },
  patientPhoneNumber: { type: String },
  patientAddress: { type: String },
  fatherName: { type: String },
  title: { type: String },
  gender: { type: String },
  pid: { type: String },
  age: { type: String },
  consultantName: { type: String },
  paymentType: { type: String },
  paymentStatus: { type: String },
  items: { type: [ItemSchema] },
  grandTotalWithGST: { type: String },
  grandTotalWithOutGST: { type: String },
  total: { type: String },
  invoiceID: { type: String },
  invoiceDate: { type: String },
  gstAdded: { type: Boolean },
});

module.exports = mongoose.model("invoice-management", invoiceSchema);
