const express = require("express");
const router = express.Router();
const Product = require("../model/product");

router.post("/create", async (req, res) => {
  // const product = new Product(req.body);
  // await product.save();
  // res.send(product);
  try {
    const {
      medicineName,
      price,
      quantity,
      expiryDate,
      createdAt,
      createdBy,
      updatedBy,
      updatedOn,
    } = req.body;
    // Check if a patient with the same name and age exists
    const existingProduct = await Product.findOne({ medicineName });

    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Medicine with this name already exists" });
    }

    // If patient doesn't exist, create a new one
    const newMedicine = new Product({
      medicineName,
      price,
      quantity,
      expiryDate,
      createdAt,
      createdBy,
      updatedBy,
      updatedOn,
    });
    await newMedicine.save();
    res.status(201).json({
      message: "Medicine created successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getAll", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

router.get("/getMedicine/:name", async (req, res) => {
  try {
    const searchTerm = req.params.name;
    const regex = new RegExp(`.*${searchTerm}.*`, "i");
    const products = await Product.find({
      medicineName: { $regex: regex },
    });
    if (products) {
      res.send(products);
    } else {
      res.status(409).json({ message: "not data error", error });
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/getProductById/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

router.put("/updateProductById/:id", async (req, res) => {
  const id = req.params.id;
  const {
    medicineName,
    price,
    quantity,
    expiryDate,
    createdAt,
    createdBy,
    updatedBy,
    updatedOn,
  } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        medicineName,
        price,
        quantity,
        expiryDate,
        createdAt,
        createdBy,
        updatedBy,
        updatedOn,
      },
      {
        new: true,
      }
    );
    res.send(product);
  } catch (er) {
    console.log(er);
    res.status(500);
  }
});

router.delete("/deleteProductById/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: "Product deleted" });
});

module.exports = router;
