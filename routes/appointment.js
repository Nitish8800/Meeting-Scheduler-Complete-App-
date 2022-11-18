const express = require("express");
const router = express.Router();
const Roles = require("../constants/roles");
const { auth, authorizeRoles } = require("../middleware/auth");
const objectIdValidator = require("../middleware/validator/objectIDValidator");

const {
  createAppointment,
  allAppointments,
  getSingleAppointment,
  deleteAppointment,
  getExistAppointments,
  UpdateAppointments,
} = require("../controllers/appointment");

const {
  createAppointmentValidation,
  appointmentUpdateValidation,
} = require("../middleware/validator/appointment/appointmentValidator");

// USer Access Route
// Create New Appointment
router.post(
  "/",
  createAppointmentValidation,
  auth,
  authorizeRoles(Roles.USER),
  createAppointment
);

// Get All Appoitnment by Users And Doctors
router.get("/", auth, getExistAppointments);

router.get("/all", auth, authorizeRoles(Roles.ADMIN), allAppointments);

// Get Single Appointment and delete single appointment
router
  .route("/:id")
  .get(
    objectIdValidator,
    auth,
    authorizeRoles(Roles.USER),
    getSingleAppointment
  )
  .put(objectIdValidator, appointmentUpdateValidation, auth, UpdateAppointments)
  .delete(
    objectIdValidator,
    auth,
    authorizeRoles(Roles.USER),
    deleteAppointment
  );

module.exports = router;
