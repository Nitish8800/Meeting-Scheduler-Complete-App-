const Doctor = require("../../models/Doctor.Model");
const controller = require("../../config/controller/controller");
const { ObjectID } = require("mongodb");
const sendMail = require("../../utils/sendMail");
var generator = require("generate-password");

// Get Doctor Details
const getDoctorDetails = controller(async (req, res) => {
  const doctor = await Doctor.findById(req.user.id);
  if (!doctor) {
    return res.status(404).send({ success: false, message: " Not Found" });
  }
  res.status(200).send({
    success: true,
    message: "Get Single Doctor Details",
    data: doctor,
  });
});

// Create a new Doctor
const createDoctor = controller(async (req, res) => {
  const doctor = new Doctor(req.body);

  const generatedPassword = generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
  });
  doctor.password = generatedPassword;

  const response = await doctor.save();

  const message = `You Can Login Now With This \n\n   Email :- ${doctor.email} \n\n  Password :-  ${generatedPassword}`;

  await sendMail({
    email: doctor.email,
    subject: `Doctor Profile Created Successfully`,
    message,
  });

  res.status(200).send({
    success: true,
    message: "Doctor Created Successfully",
    data: doctor,
  });
  console.log("response", response);
});

// get All Doctor
const getAllDoctors = controller(async (req, res) => {
  let data = await Doctor.find();
  res.status(200).send({
    success: true,
    message: "All Doctors Get Successfully",
    data: data,
  });
});

// Get Single Doctor
const getSingleDoctor = controller(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send({
      success: false,
      message: `Invalid Object ID ${req.params.id}`,
    });
  }
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res
      .status(404)
      .send({ success: false, message: "Doctor Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "Single Doctor Get Successfully",
    data: doctor,
  });
});

// Delete Doctor
const deleteDoctor = controller(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`No Record with given ID ${req.params.id}`);
  }

  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    return res
      .status(404)
      .send({ success: false, message: "Doctor Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "Doctor deleted succesfully",
  });
});

// Update Doctor by admin
const updateDoctor = controller(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`No Record with given ID ${req.params.id}`);
  }
  const data = await Doctor.findByIdAndUpdate(req.params.id);
  if (!data) {
    return res
      .status(404)
      .send({ success: false, message: "Doctor Not Found" });
  }
  Object.entries(req.body).forEach(([key, value]) => {
    data[key] = value;
  });

  const updatedDoctor = await data.save();
  res.status(200).send({
    success: true,
    message: "Doctor Updated successfully",
    data: updatedDoctor,
  });
});

module.exports = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
  getDoctorDetails,
};
