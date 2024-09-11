const express = require("express");
const router = express.Router();
const Doctor = require("../model/doctors");

router.post("/create", async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.send(doctor);
});

router.get("/getAll", async (req, res) => {
  const doctor = await Doctor.find();
  res.send(doctor);
});

router.get("/getDoctorById/:id", async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  res.send(doctor);
});

router.put("/updateDoctorById/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(doctor);
  } catch (err) {}
});

router.delete("/deleteDoctorById/:id", async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.send({ message: "Doctor deleted" });
});

module.exports = router;
