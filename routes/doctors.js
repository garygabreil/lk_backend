const express = require("express");
const router = express.Router();
const Doctor = require("../model/doctors");

router.post("/create", async (req, res) => {
  try {
    const { consultantName, speciality } = req.body;
    const cleanConsultantName = consultantName
      ? consultantName.replace(/\s+/g, "").toLowerCase()
      : ""; // Default value if consultantName is null or undefined

    const name = cleanConsultantName;

    // Check if a doctor with the same consultantName and speciality already exists
    const existingDoctor = await Doctor.findOne({
      consultantName: name,
      speciality: speciality,
    });
    if (existingDoctor) {
      // If doctor already exists, send an error response
      return res.status(400).send({
        message: `Doctor with name ${cleanConsultantName} already exists.`,
      });
    }
    // If no matching doctor exists, create a new doctor
    const doctor = new Doctor({
      ...req.body,
      consultantName: cleanConsultantName, // Save the cleaned name to the DB
    });

    await doctor.save();
    // Send a success response with the saved doctor
    res.status(201).send(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while creating the doctor.",
      error: error.message,
    });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const doctor = await Doctor.find();
    res.send(doctor);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getDoctorById/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.send(doctor);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateDoctorById/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(doctor);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/deleteDoctorById/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.send({ message: "Doctor deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
