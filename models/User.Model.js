const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    phoneNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    address: {
      street1: { type: "String", required: true },
      street2: { type: "String", required: true },
      country: { type: "String", required: true },
      state: { type: "String", required: true },
      pin: { type: "Number", required: true },
    },
    isAdmin: { type: "String", default: "user" },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var salt = bcrypt.genSaltSync(10);

  if (this.password && this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});


const User = mongoose.model("user", userSchema);

module.exports = User;
