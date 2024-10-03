const express = require("express");
const router = express.Router();
const Patient = require("../model/patient");

router.post("/create", async (req, res) => {
  try {
    const { patientName, age } = req.body;
    // Check if a patient with the same name and age exists
    const clearPatientName = patientName
      ? patientName.replace(/\s+/g, "").toUpperCase()
      : ""; // Default value if consultantName is null or undefined

    const existingPatient = await Patient.findOne({
      patientName: clearPatientName,
      age: age,
    });

    if (existingPatient) {
      return res
        .status(409)
        .json({ message: "Patient with this name and age already exists" });
    }

    // If patient doesn't exist, create a new one
    const newPatient = new Patient({
      ...req.body,
      patientName: clearPatientName, // Save the cleaned name to the DB
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
  try {
    const patient = await Patient.find();
    res.send(patient);
  } catch (error) {
    console.log(error);
  }
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
  try {
    const patient = await Patient.findById(req.params.id);
    res.send(patient);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updatePatientById/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(patient);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/deletePatientById/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id.trim());
    res.send({ message: "Patient deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
