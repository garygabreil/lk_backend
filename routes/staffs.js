const express = require("express");
const router = express.Router();
const Staff = require("../model/staffs");

router.post("/create", async (req, res) => {
  const staff = new Staff(req.body);
  await staff.save();
  res.send(staff);
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
  await Staff.findByIdAndDelete(req.params.id);
  res.send({ message: "Staff deleted" });
});

module.exports = router;
