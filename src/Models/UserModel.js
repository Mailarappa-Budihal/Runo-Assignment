const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true, trim: true },
    PhoneNumber: { type: Number, required: true, unique: true, trim: true },
    Age: { type: Number, required: true, unique: false, trim: true },
    Pincode: { type: Number, required: true, trim: true },
    AdharNo: { type: Number, required: true, unique: true, trim: true },
    password: { type: String, trim: true },
    firstDose: {
        date: { type: Date, default: null },
        Time: { type: String },


    },
    SecondDose: {
        date: { type: Date, default: null },
        Time: { type: String },


    },
    VaccineStatus: { type: String, enum: ["non", "firstDoseCompleted", "Allcompleted"], default: "non" },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);