const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Supplier = require("../model/supplier");

router.post("/create", async (req, res) => {
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
      mid,
      hsn_code,
      batch,
      priceOfOne,
      sgst,
      supplierAddress,
      supplierName,
      supplierPhone,
      pack,
    } = req.body;

    // Transform medicineName, batch, and hsn_code to uppercase
    const cleanMedicineName = medicineName
      ? medicineName.replace(/\s+/g, "_").toUpperCase()
      : "";
    const cleanBatch = batch ? batch.replace(/\s+/g, "_").toUpperCase() : "";
    const cleanHsnCode = hsn_code
      ? hsn_code.replace(/\s+/g, "_").toUpperCase()
      : "";

    const cleanSupplierAddress = supplierAddress
      ? supplierAddress.replace(/\s+/g, "_").toUpperCase()
      : "";
    const cleanSupplierName = supplierName
      ? supplierName.replace(/\s+/g, "_").toUpperCase()
      : "";

    // Check if a product with the same medicineName, batch, and hsn_code exists
    const existingProduct = await Product.findOne({
      medicineName: cleanMedicineName,
      batch: cleanBatch,
      hsn_code: cleanHsnCode,
      supplierName: cleanSupplierName,
      supplierAddress: cleanSupplierAddress,
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Medicine with this name, batch, and HSN code already exists",
      });
    }

    // If no existing product, create a new medicine
    const newMedicine = new Product({
      medicineName: cleanMedicineName,
      price,
      quantity,
      expiryDate,
      createdAt,
      createdBy,
      updatedBy,
      updatedOn,
      mid,
      hsn_code: cleanHsnCode,
      batch: cleanBatch,
      priceOfOne,
      sgst,
      supplierName: cleanSupplierName,
      supplierAddress: cleanSupplierAddress,
      supplierPhone,
      pack,
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
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error);
  }
});

router.post("/getMedicine", async (req, res) => {
  try {
    // Assuming req.body is an object, extract the searchTerm properly
    const searchTerm = req.body.medicineName; // Make sure you're sending { searchTerm: 'your search term' }

    // If no searchTerm is provided, return an error
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Use a regex to perform case-insensitive partial matching
    const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitivity

    // Find medicines that match the search term in their name
    const products = await Product.find({
      medicineName: { $regex: regex },
    });

    // Check if products are found
    if (products.length > 0) {
      res.send(products);
    } else {
      res.status(404).json({ message: "No medicine found" });
    }
  } catch (err) {
    console.error(err); // Log error to server console
    res.status(500).send({ message: "An error occurred", error: err });
  }
});

router.post("/getSupplier", async (req, res) => {
  try {
    // Assuming req.body is an object, extract the searchTerm properly
    const searchTerm = req.body.supplierName; // Make sure you're sending { searchTerm: 'your search term' }

    // If no searchTerm is provided, return an error
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Use a regex to perform case-insensitive partial matching
    const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitivity

    // Find medicines that match the search term in their name
    const products = await Product.find({
      supplierName: { $regex: regex },
    });

    // Check if products are found
    if (products.length > 0) {
      res.send(products);
    } else {
      res.status(404).json({ message: "No medicine found" });
    }
  } catch (err) {
    console.error(err); // Log error to server console
    res.status(500).send({ message: "An error occurred", error: err });
  }
});

router.post("/getHSNCode", async (req, res) => {
  try {
    // Assuming req.body is an object, extract the searchTerm properly
    const searchTerm = req.body.hsn_code; // Make sure you're sending { searchTerm: 'your search term' }

    // If no searchTerm is provided, return an error
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Use a regex to perform case-insensitive partial matching
    const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitivity

    // Find medicines that match the search term in their name
    const products = await Product.find({
      hsn_code: { $regex: regex },
    });

    // Check if products are found
    if (products.length > 0) {
      res.send(products);
    } else {
      res.status(404).json({ message: "No medicine found" });
    }
  } catch (err) {
    console.error(err); // Log error to server console
    res.status(500).send({ message: "An error occurred", error: err });
  }
});

router.post("/getBatch", async (req, res) => {
  try {
    // Assuming req.body is an object, extract the searchTerm properly
    const searchTerm = req.body.batch; // Make sure you're sending { searchTerm: 'your search term' }

    // If no searchTerm is provided, return an error
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Use a regex to perform case-insensitive partial matching
    const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitivity

    // Find medicines that match the search term in their name
    const products = await Product.find({
      batch: { $regex: regex },
    });

    // Check if products are found
    if (products.length > 0) {
      res.send(products);
    } else {
      res.status(404).json({ message: "No medicine found" });
    }
  } catch (err) {
    console.error(err); // Log error to server console
    res.status(500).send({ message: "An error occurred", error: err });
  }
});

router.get("/getProductById/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateProductById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      medicineName,
      price,
      quantity,
      expiryDate,
      createdAt,
      createdBy,
      updatedBy,
      updatedOn,
      mid,
      hsn_code,
      batch,
      priceOfOne,
      sgst,
      supplierName,
      supplierAddress,
      supplierPhone,
      pack,
    } = req.body;

    // Transform medicineName, batch, and hsn_code to uppercase and replace spaces in medicineName
    const cleanMedicineName = medicineName
      ? medicineName.replace(/\s+/g, "_").toUpperCase()
      : "";
    const cleanBatch = batch ? batch.replace(/\s+/g, "_").toUpperCase() : "";
    const cleanHsnCode = hsn_code
      ? hsn_code.replace(/\s+/g, "_").toUpperCase()
      : "";

    const cleanSupplierAddress = supplierAddress
      ? supplierAddress.replace(/\s+/g, "_").toUpperCase()
      : "";
    const cleanSupplierName = supplierName
      ? supplierName.replace(/\s+/g, "_").toUpperCase()
      : "";

    // Update the product with the cleaned data
    const updatedMedicine = await Product.findByIdAndUpdate(
      id,
      {
        medicineName: cleanMedicineName,
        price,
        quantity,
        expiryDate,
        createdAt,
        createdBy,
        updatedBy,
        updatedOn,
        mid,
        hsn_code: cleanHsnCode,
        batch: cleanBatch,
        priceOfOne,
        sgst,
        supplierName: cleanSupplierName,
        supplierAddress: cleanSupplierAddress,
        supplierPhone: supplierPhone,
        pack,
      },
      { new: true } // Return the updated document
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        message: `Medicine with ID ${id} not found`,
      });
    }

    // Send a success response with the updated medicine
    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/deleteProductById/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: "Product deleted" });
  } catch (error) {
    console.log(er);
  }
});

router.post("/updateQ", async (req, res) => {
  const medicinesToSubtract = req.body;
  try {
    for (let med of medicinesToSubtract) {
      // Ensure mid exists
      if (!med.mid) {
        continue;
      }

      // Ensure quantity is a valid number and convert to integer
      let quantityToSubtract = parseInt(med.quantity, 10); // Parse quantity as an integer

      // If parsing fails (NaN) or if quantity is less than or equal to zero, skip
      if (isNaN(quantityToSubtract)) {
        continue; // Skip invalid medicines
      }

      // Convert to a negative number for decrementing
      quantityToSubtract = Math.abs(quantityToSubtract); // Ensure it's positive
      quantityToSubtract = -quantityToSubtract; // Convert to negative for subtraction

      // Subtract the quantity using $inc to decrement the existing quantity
      const result = await Product.updateOne(
        { mid: med.mid }, // Find the medicine by medicineId
        { $inc: { quantity: quantityToSubtract } } // Subtract the quantity using $inc
      );

      if (result.matchedCount > 0) {
        console.log(
          `Updated medicine ${med.mid}, subtracted ${Math.abs(
            quantityToSubtract
          )}`
        );
      } else {
        console.log(`Medicine ${med.mid} not found`);
      }
    }
  } catch (error) {
    console.error("Error updating medicines:", error);
  }
});

router.post("/search", async (req, res) => {
  try {
    // Destructure the search query parameters from the request
    const { medicineName, hsn_code, batch, supplierName } = req.body;
    // Build a search object dynamically based on provided query params
    let searchCriteria = {};

    if (medicineName) {
      // Search case-insensitive and replace spaces with underscores
      searchCriteria.medicineName = new RegExp(
        medicineName.replace(/\s+/g, "_"),
        "i"
      );
    }
    if (supplierName) {
      // Search case-insensitive and replace spaces with underscores
      searchCriteria.supplierName = new RegExp(
        supplierName.replace(/\s+/g, "_"),
        "i"
      );
    }
    if (hsn_code) {
      searchCriteria.hsn_code = hsn_code.toUpperCase();
    }
    if (batch) {
      searchCriteria.batch = batch.toUpperCase();
    }

    // Execute the search query
    const products = await Product.find(searchCriteria);

    // Respond with the search results
    res.status(200).json(products);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
