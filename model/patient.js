const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: { type: String, require: false },
  patientPhoneNumber: { type: String },
  patientAddress: { type: String, require: false },
  fatherName: { type: String },
  title: { type: String, require: false },
  gender: { type: String },
  visitDate: {
    type: String,
  },
  pid: { type: String },
  age: { type: String },
  consultantName: { type: String },
  createdOn: { type: String },
  updatedOn: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
  age: { type: String },
  type: { type: String },
  symptoms: { type: String },
  medicinesPrescribed: { type: String },
  remarks: { type: String },
  paymentType: { type: String },
  paymentStatus: { type: String },
  nextVisit: { type: String },
  bp: { type: String },
  sp02: { type: String },
  pulse: { type: String },
  sugar: { type: String },
  appointmentId: { type: String },
});
module.exports = mongoose.model("patient-management", patientSchema);
