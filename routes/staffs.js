const express = require("express");
const router = express.Router();
const Staff = require("../model/staffs");

router.post("/create", async (req, res) => {
  try {
    const { staffName, type } = req.body;

    // Clean staffName and handle if it's null or undefined
    const cleanStaffName = staffName
      ? staffName.replace(/\s+/g, "").toLowerCase()
      : null; // Set null for better handling in the DB query

    // Ensure we only proceed if staffName and type are present
    if (!cleanStaffName || !type) {
      return res.status(400).send({
        message: "Both staff name and type are required.",
      });
    }

    // Check if a staff with the same staffName and type already exists
    const existingStaff = await Staff.findOne({
      staffName: cleanStaffName,
      type: type,
    });

    if (existingStaff) {
      // If staff already exists, send an error response
      return res.status(400).send({
        message: `Staff with name ${staffName} and type ${type} already exists.`,
      });
    }

    // If no matching staff exists, create a new staff
    const staff = new Staff({
      ...req.body,
      staffName: cleanStaffName, // Save the cleaned name to the DB
    });

    await staff.save();
    // Send a success response with the saved staff
    res.status(201).send(staff);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while creating the staff.",
      error: error.message,
    });
  }
});

router.get("/getAll", async (req, res) => {
  const staff = await Staff.find();
  res.send(staff);
});

router.get("/getStaffById/:id", async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  res.send(staff);
});

router.put("/updateStaffById/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(staff);
  } catch (err) {}
});

router.get("/getStaffByPID/:pid", async (req, res) => {
  Staff.findOne({ pid: req.params.pid })
    .then((staff) => {
      if (staff) {
        res.send(staff);
      } else {
        res.send({ message: "user not found" });
      }
    })
    .catch((err) => {
      //console.error(err);
      res.send(err);
    });
});

router.delete("/deleteStaffById/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.send({ message: "Staff deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
