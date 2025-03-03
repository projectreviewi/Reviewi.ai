const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// ✅ Add a new client
router.post("/", async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const newClient = new Client({ name, phone, email });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: "Error adding client" });
  }
});

// ✅ Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving clients" });
  }
});

// ✅ Get a single client by phone number
router.get("/:phone", async (req, res) => {
  try {
    const client = await Client.findOne({ phone: req.params.phone });
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving client" });
  }
});

module.exports = router;
