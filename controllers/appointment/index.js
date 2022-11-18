const Appointment = require("../../models/Appointment.Model");
const Patient = require("../../models/Patient.Model");
const Doctor = require("../../models/Doctor.Model");
const User = require("../../models/User.Model");
const controller = require("../../config/controller/controller");
const { ObjectID } = require("mongodb");
const Roles = require("../../constants/roles");

// Create a new Appointment
const createAppointment = controller(async (req, res) => {
  // here will be the checking for patient belonging to login user.
  let patientID = req.body.patient;
  let doctorID = req.body.doctor;
  const patient_details = await Patient.findById(patientID);

  if (!patient_details) {
    return res.status(400).send({
      success: false,
      message: "Patient Details Not Found",
    });
  }

  if (patient_details.userID.toString() !== req.user._id.toString()) {
    return res.status(400).send({
      success: false,
      message: "Patient User Not Match",
    });
  }

  // Here will be the checking for Doctor existing in the system.
  const doctor_details = await Doctor.findById(doctorID);

  if (!doctor_details) {
    return res.status(400).send({
      success: false,
      message: "Doctor Details Not Found",
    });
  }

  const appointment = new Appointment(req.body);

  await appointment.save();
  await appointment.populate([
    {
      path: "patient",
      populate: [
        {
          path: "userID",
          model: User,
        },
      ],
    },
    "doctor",
  ]);

  res.status(200).send({
    success: true,
    message: "Appointment Created Successfully",
    data: appointment,
  });
});

// get exist user and doctors appointments
const getExistAppointments = controller(async (req, res) => {
  const loggedUser = req.user;

  const userID = loggedUser.id;

  var getAppointments;

  if (loggedUser.isAdmin === Roles.USER) {
    const patientsCreatedByUser = await Patient.find({ userID });
    console.log("patientsCreatedByUser", patientsCreatedByUser);

    const patientIdsCreatedByUser = patientsCreatedByUser.map(
      (patient) => patient._id
    );
    // console.log("patientIdsCreatedByUser", patientIdsCreatedByUser);

    getAppointments = await Appointment.find({
      patient: {
        $in: patientIdsCreatedByUser,
      },
    }).populate([
      {
        path: "patient",
        populate: [
          {
            path: "userID",
            model: User,
          },
        ],
      },
      "doctor",
    ]);
  }

  if (loggedUser.role === Roles.DOCTOR) {
    const docotorID = loggedUser._id;

    getAppointments = await Appointment.find({
      doctor: {
        $in: docotorID,
      },
    }).populate([
      {
        path: "patient",
        populate: [
          {
            path: "userID",
            model: User,
          },
        ],
      },
      "doctor",
    ]);
  }

  res.status(200).send({
    success: true,
    message: "All Appointments Get Successfully",
    data: getAppointments,
  });
});

// get All Appointment by admin
const allAppointments = controller(async (req, res) => {
  const data = await Appointment.find().populate([
    {
      path: "patient",
      populate: [
        {
          path: "userID",
          model: User,
        },
      ],
    },
    "doctor",
  ]);

  res.status(200).send({
    success: true,
    message: "All Appointments Get Successfully",
    data: data,
  });
});

// Get Single Appointment
const getSingleAppointment = controller(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate([
    {
      path: "patient",
      populate: [
        {
          path: "userID",
          model: User,
        },
      ],
    },
    "doctor",
  ]);
  if (!appointment) {
    return res
      .status(404)
      .send({ success: false, message: "Appointment Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "Single Appointment Get Successfully",
    data: appointment,
  });
});

// Delete Appointment
const deleteAppointment = controller(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    return res
      .status(404)
      .send({ success: false, message: "Appointment Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "Appointment deleted succesfully",
  });
});

// Update Doctor Appointment
const UpdateAppointments = controller(async (req, res) => {
  const loggedUser = req.user;

  if (loggedUser.role !== Roles.DOCTOR) {
    return res.status(403).send({ success: false, message: "UnAuthorized" });
  }

  const doctorID = loggedUser._id;
  const appointmentID = req.params.id;

  const getAppointmentsForUpdate = await Appointment.findById(appointmentID);

  if (doctorID === getAppointmentsForUpdate.doctor) {
    getAppointmentsForUpdate.status = req.body.status;
  }

  res.status(200).send({
    success: true,
    message: "All Appointments Get Successfully",
    data: getAppointmentsForUpdate,
  });
});

module.exports = {
  createAppointment,
  allAppointments,
  getSingleAppointment,
  deleteAppointment,
  getExistAppointments,
  UpdateAppointments,
};
