const express = require("express");
const router = express.Router();
const Roles = require("../constants/roles");
const { auth, authorizeRoles } = require("../middleware/auth");
const objectIdValidator = require("../middleware/validator/objectIDValidator");

const {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
  getDoctorDetails,
} = require("../controllers/doctor");

const {
  createDoctorValidation,
  doctorUpdateValidation,
} = require("../middleware/validator/doctor/doctorValidation");

// Doctor get their profile
router.get("/me", auth, getDoctorDetails);

// Admin Access Route
// Create New Docotor
router.post(
  "/",
  createDoctorValidation,
  auth,
  authorizeRoles(Roles.ADMIN),
  createDoctor
);

// get all docotor
router.get("/", auth, getAllDoctors);

// Get, Udpate and Delete the single doctor by admin
router
  .route("/:id")
  .get(objectIdValidator, auth, authorizeRoles(Roles.ADMIN), getSingleDoctor)
  .put(
    objectIdValidator,
    doctorUpdateValidation,
    auth,
    authorizeRoles(Roles.ADMIN),
    updateDoctor
  )
  .delete(objectIdValidator, auth, authorizeRoles(Roles.ADMIN), deleteDoctor);

module.exports = router;
