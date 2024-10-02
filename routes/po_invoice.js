const express = require("express");
const router = express.Router();
const Invoice = require("../model/po_invoice");
const Product = require("../model/product");

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.send(invoices);
  } catch (error) {
    console.log(error);
  }
});

// Get one invoice
router.get("/getInvoiceByID/:id", async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create an invoice
router.post("/create", async (req, res) => {
  try {
    // Make a copy of the entire request body to preserve all fields
    let invoiceData = { ...req.body };
    console.log(invoiceData);

    // If invoiceDate exists, convert it to "dd-MM-yyyy"
    if (invoiceData.invoiceDate) {
      const [year, month, day] = invoiceData.invoiceDate.split("-");
      invoiceData.invoiceDate = `${day}-${month}-${year}`; // Update the date format
    }

    // Check if the invoice ID already exists
    const existingInvoice = await Invoice.findOne({
      invoiceID: invoiceData.invoiceID,
    });

    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice ID already exists." });
    }

    // Create a new Invoice with the updated data
    const invoice = new Invoice(invoiceData);

    // Save the new invoice
    const newInvoice = await invoice.save();

    // Respond with the newly created invoice ID
    res.status(201).json({ _id: newInvoice._id });
  } catch (err) {
    // Handle errors and respond
    res.status(400).json({ message: err.message });
    console.error(err);
  }
});

// Update an invoice
router.put("/updateInvoiceById/:id", async (req, res) => {
  try {
    const invoiceId = req.params.id;

    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required." });
    }

    // Check if the invoice exists
    const existingInvoice = await Invoice.findById({ _id: invoiceId });
    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Initialize updatedData
    let updatedData = {};

    // Iterate over request body fields and update only non-empty values
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== null && value !== undefined && value !== "") {
        updatedData[key] = value;
      }
    }

    // Handle invoiceDate format conversion if present
    if (req.body.invoiceDate) {
      const [year, month, day] = req.body.invoiceDate.split("-");
      updatedData.invoiceDate = `${day}-${month}-${year}`;
    }

    // Check for uniqueness of the 'invoice' field (if provided)
    if (updatedData.invoice) {
      const duplicateInvoice = await Invoice.findOne({
        invoice: updatedData.invoice,
        _id: { $ne: invoiceId }, // Exclude the current invoice
      });

      if (duplicateInvoice) {
        return res.status(400).json({ message: "Invoice must be unique." });
      }
    }
    // Perform the update
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      updatedData,
      {
        new: true, // Return the updated document
        omitUndefined: true, // Skip undefined fields in update
      }
    );

    res.json(updatedInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete an invoice
router.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await Invoice.findByIdAndDelete({ _id: _id });
    res.json({ message: "Deleted Invoice" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/groupedInvoicesByDate", async (req, res) => {
  try {
    const dateString = req.body; // Example date in DD-MM-YYYY format
    const groupedInvoices = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: dateString, // Direct string comparison
        },
      },
      {
        $group: {
          _id: { date: "$invoiceDate", patientId: "$patientId" },
          totalAmount: { $sum: "$totalAmount" },
          patientName: { $first: "$patientName" },
          patientAddress: { $first: "$patientAddress" },
          items: { $push: "$items" },
          invoiceID: { $first: "$invoiceID" },
          invoiceDate: { $first: "$invoiceDate" },
          gstAdded: { $first: "$gstAdded" },
          grandTotalWithGST: { $first: "$grandTotalWithGST" },
          grandTotalWithOutGST: { $first: "$grandTotalWithOutGST" },
          total: { $first: "$total" },
          _id: { date: "$invoiceDate" },
          items: { $push: "$items" },
          patientName: { $first: "$patientName" },
          paymentStatus: { $first: "$paymentStatus" },
          paymentType: { $first: "$paymentType" },
          title: { $first: "$title" },
          gender: { $first: "$gender" },
          pid: { $first: "$pid" },
        },
      },
      {
        $sort: { "_id.date": 1 }, // Sort by date
      },
    ]);
    res.json(groupedInvoices);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/getInvoiceByDate", async (req, res) => {
  const invoiceDate = req.body.invoiceDate;
  try {
    const invoices = await Invoice.find({ invoiceDate: invoiceDate });
    res.send(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching invoices." });
  }
});

router.get("/getQ/", async (req, res) => {
  try {
    const order = await Product.findOne({ medicineName: "dolo " });
    console.log(order);
  } catch (error) {
    console.log(error);
  }
});

router.post("/searchInvoice", async (req, res) => {
  const { paymentType, paymentStatus, supplierName, invoiceDate } = req.body;

  console.log(req.body);

  try {
    const searchCriteria = {};

    // Handle paymentType search
    if (paymentType) {
      searchCriteria.paymentType = paymentType;
    }

    // Handle paymentStatus search (trim to remove extra spaces)
    if (paymentStatus) {
      searchCriteria.paymentStatus = paymentStatus.trim();
    }

    // Handle patientName search (case-insensitive, partial match)
    if (supplierName) {
      searchCriteria.supplierName = { $regex: supplierName, $options: "i" };
    }

    // Handle invoiceDate search (convert from dd-MM-yyyy to ISODate)
    if (invoiceDate) {
      searchCriteria.invoiceDate = invoiceDate;
    }

    // Find invoices based on search criteria
    const invoices = await Invoice.find(searchCriteria);

    if (invoices.length === 0) {
      return res.status(404).send({ message: "No_invoices" });
    }

    res.send(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res
      .status(500)
      .send({ error: "An error occurred while searching for invoices." });
  }
});

module.exports = router;
