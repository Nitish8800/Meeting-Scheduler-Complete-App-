const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "doctor",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: "String", required: true },
    address: {
      street1: { type: "String", required: true },
      street2: { type: "String", required: true },
      country: { type: "String", required: true },
      state: { type: "String", required: true },
      pin: { type: "Number", required: true },
    },
    specialisation: { type: "String" },
    fees: { type: "Number" },
    createdDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

doctorSchema.pre("save", function (next) {
  var salt = bcrypt.genSaltSync(10);

  if (this.password && this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});


const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
