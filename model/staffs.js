const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  title: { type: String, require: false },
  staffName: { type: String, require: false },
  phone: { type: String, require: false },
  type: { type: String, require: false },
  address: { type: String, require: false },
  pid: { type: String, require: false },
  createdOn: { type: String },
  updatedOn: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
});
module.exports = mongoose.model("staff-management", staffSchema);
