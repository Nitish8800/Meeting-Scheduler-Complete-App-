const mongoose = require("mongoose");
const User = require("./User.Model");

const patientSchema = mongoose.Schema(
  {
    userRelationship: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    createdDate: {
      type: Date,
    },
  },

  { timestamps: true }
);

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
