const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Ensure unique phone numbers
  email: { type: String },
  reviewStatus: { type: String, enum: ["pending", "sent", "completed"], default: "pending" }, // Track review process
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
