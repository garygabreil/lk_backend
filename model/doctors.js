const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  title: { type: String, require: false },
  consultantName: { type: String, require: false },
  phone: { type: String, require: false },
  speciality: { type: String, require: false },
  address: { type: String, require: false },
  pid: { type: String, require: false },
  createdOn: { type: String },
  updatedOn: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
});
module.exports = mongoose.model("doctor-management", doctorSchema);
