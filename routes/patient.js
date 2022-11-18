const express = require("express");
const router = express.Router();
const Roles = require("../constants/roles");
const { auth, authorizeRoles } = require("../middleware/auth");
const objectIdValidator = require("../middleware/validator/objectIDValidator");

const {
  createPatient,
  allPatients,
  getSinglePatient,
  deletePatient,
  updatePatient,
} = require("../controllers/patient");

const {
  createPatientValidation,
  patientUpdateValidation,
} = require("../middleware/validator/patient/patientValidation");

// USer Access Route
// Create New Patient
router.post(
  "/",
  createPatientValidation,
  auth,
  authorizeRoles(Roles.USER),
  createPatient
);

// get all patient by user
router.get("/", auth, authorizeRoles(Roles.USER), allPatients);

router
  .route("/:id")
  .get(objectIdValidator, auth, authorizeRoles(Roles.USER), getSinglePatient)
  .put(
    objectIdValidator,
    patientUpdateValidation,
    auth,
    authorizeRoles(Roles.USER),
    updatePatient
  )
  .delete(objectIdValidator, auth, authorizeRoles(Roles.USER), deletePatient);

module.exports = router;
