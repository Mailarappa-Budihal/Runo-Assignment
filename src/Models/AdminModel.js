const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    Name: { type: String, required: true, trim: true },
    PhoneNumber: { type: String, required: true, unique: true, trim: true },
    Age: { type: Number, required: true, unique: false, trim: true },
    password: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("admin", adminSchema);