const express = require("express");
const router = express.Router();
const Patient = require("../model/patient");

router.post("/create", async (req, res) => {
  // const patient = new Patient(req.body);
  // const existingPatient = await Patient.findOne({ name, age });
  //await patient.save();
  //res.send(patient);
  try {
    const {
      patientName,
      patientPhoneNumber,
      patientAddress,
      fatherName,
      title,
      gender,
      visitDate,
      pid,
      dob,
      consultantName,
      createdOn,
      updatedOn,
      createdBy,
      updatedBy,
      age,
      type,
      symptoms,
      medicinesPrescribed,
      remarks,
      paymentType,
      paymentStatus,
      nextVisit,
      bp,
      sp02,
      pulse,
      sugar,
      appointmentId,
    } = req.body;
    // Check if a patient with the same name and age exists
    const existingPatient = await Patient.findOne({ patientName, age });

    if (existingPatient) {
      return res
        .status(409)
        .json({ message: "Patient with this name and age already exists" });
    }

    // If patient doesn't exist, create a new one
    const newPatient = new Patient({
      patientName,
      patientPhoneNumber,
      patientAddress,
      fatherName,
      title,
      gender,
      visitDate,
      pid,
      dob,
      consultantName,
      createdOn,
      updatedOn,
      createdBy,
      updatedBy,
      age,
      type,
      symptoms,
      medicinesPrescribed,
      remarks,
      paymentType,
      paymentStatus,
      nextVisit,
      bp,
      sp02,
      pulse,
      sugar,
      appointmentId,
    });
    await newPatient.save();
    res
      .status(201)
      .json({ message: "Patient created successfully", patient: newPatient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getAll", async (req, res) => {
  const patient = await Patient.find();
  res.send(patient);
});

router.get("/getName/:name", async (req, res) => {
  try {
    const searchTerm = req.params.name;
    const regex = new RegExp(`.*${searchTerm}.*`, "i");
    const patient = await Patient.find({
      patientName: { $regex: regex },
    });
    if (patient) {
      res.send(patient);
    } else {
      res.status(409).json({ message: "not data error", error });
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/getPatientById/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.send(patient);
});

router.put("/updatePatientById/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(patient);
});

router.delete("/deletePatientById/:id", async (req, res) => {
  console.log(req.params.id);
  await Patient.findByIdAndDelete(req.params.id.trim());
  res.send({ message: "Patient deleted" });
});

module.exports = router;
