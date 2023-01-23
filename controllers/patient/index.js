const Patient = require("../../models/Patient.Model");
const controller = require("../../config/controller/controller");
const { ObjectID } = require("mongodb");

// Create a new Patient
const createPatient = controller(async (req, res) => {
  const patient = new Patient(req.body);

  if (!patient) {
    return res.status(400).send({
      success: false,
      message: "patient Not Found",
    });
  }

  patient.userID = req.user._id;

  await patient.save();
  await patient.populate("userID");

  res.status(200).send({
    success: true,
    message: "Patient Created Successfully",
    data: patient,
  });
});

// get All Patient which existing in user
const allPatients = controller(async (req, res) => {
  const userID = req.user._id;

  const getUserExistPatient = await Patient.find({ userID }).populate("userID");

  res.status(200).send({
    success: true,
    message: "All Exist Patients Get Successfully",
    data: getUserExistPatient,
  });
});

// Get Single Patient
const getSinglePatient = controller(async (req, res) => {
  const patientId = req.params.id;

  const patient_details = await Patient.findById(patientId).populate("userID");
  
  if (!patient_details) {
    return res
      .status(404)
      .send({ success: false, message: "Patient Not Found" });
  }

  if (patient_details.userID._id.toString() !== req.user._id.toString()) {
    return res.status(400).send({
      success: false,
      message: "Patient User Not Match",
    });
  }

  res.status(200).send({
    success: true,
    message: "Single Patient Get Successfully",
    data: patient_details,
  });
});

// Delete patient
const deletePatient = controller(async (req, res) => {
  const patientId = req.params.id;

  const patient_details = await Patient.findById(patientId);

  if (!patient_details) {
    return res
      .status(404)
      .send({ success: false, message: "Patient Not Found" });
  }

  if (patient_details.userID.toString() !== req.user._id.toString()) {
    return res.status(400).send({
      success: false,
      message: "Patient User Not Match",
    });
  }

  patient_details.remove();

  res.status(200).send({
    success: true,
    message: "Patient deleted succesfully",
  });
});

// Update patient by user
const updatePatient = controller(async (req, res) => {
  const patientId = req.params.id;

  let patient_details = await Patient.findById(patientId);

  if (!patient_details) {
    return res
      .status(404)
      .send({ success: false, message: "Patient Not Found" });
  }

  if (patient_details.userID.toString() !== req.user._id.toString()) {
    return res.status(400).send({
      success: false,
      message: "Patient User Not Match",
    });
  }

  patient_details = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await patient_details.save();
  await patient_details.populate("userID");
  res.status(200).send({
    success: true,
    message: "Patient Updated successfully",
    data: patient_details,
  });
});

module.exports = {
  createPatient,
  allPatients,
  getSinglePatient,
  deletePatient,
  updatePatient,
};
