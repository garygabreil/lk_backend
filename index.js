// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//PORT
const PORT = process.env.PORT || 3000;

// MongoDB URI
const MONGODB_URI = "mongodb://localhost/invoice-system";

/// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Define routes
const invoiceRoutes = require("./routes/invoice");
const usersRoutes = require("./routes/user");
const productsRoutes = require("./routes/product");
const patientRoutes = require("./routes/patient");
const doctorRoutes = require("./routes/doctors");
const staffRoutes = require("./routes/staffs");

app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/product", productsRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/staff", staffRoutes);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
