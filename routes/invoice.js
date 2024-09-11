const express = require("express");
const router = express.Router();
const Invoice = require("../model/invoice");

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
  const invoices = await Invoice.find();
  res.send(invoices);
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
  const invoice = new Invoice(req.body);
  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an invoice
router.put("/updateInvoiceById/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete an invoice
router.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await Invoice.findByIdAndDelete(_id);
    res.json({ message: "Deleted Invoice" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
