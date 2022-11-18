const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/multerFileUpload");
const Roles = require("../constants/roles");

const {
  getUserDetails,
  createUser,
  loginUser,
  updateUser,
  logOutUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUserRole,
  updatePassword,
} = require("../controllers/user");

const { userSignUP } = require("../middleware/validator/user/signup.validator");

const {
  validateUserLogin,
} = require("../middleware/Validator/user/login.validator");

const {
  userUpdateValidator,
  userUpdateRoleValidator,
} = require("../middleware/validator/user/userUpdate.validator.js");

const bodyParser = require("body-parser");
const objectIdValidator = require("../middleware/validator/objectIDValidator");
const {
  updatePasswordValidator,
} = require("../middleware/validator/user/update.password.validator");

router.use(bodyParser.json());

// User Access Routes
// get User Details
router.get("/me", auth, getUserDetails);

// Register New User
router.post("/signup", upload.single("pic"), userSignUP, createUser);

// Login User
router.post("/login", validateUserLogin, loginUser);

router.post("/update_password", updatePasswordValidator, auth, updatePassword);

// Update User profile
router.put(
  "/me/update",
  upload.single("pic"),
  userUpdateValidator,
  auth,
  updateUser
);

// Log out User
router.get("/logout", logOutUser);

// Admin Access Route
// get all users by admin
router.get("/", auth, authorizeRoles(Roles.ADMIN), getAllUser);

router
  .route("/:id")
  .get(objectIdValidator, auth, authorizeRoles(Roles.ADMIN), getSingleUser)
  .put(
    objectIdValidator,
    upload.single("pic"),
    userUpdateRoleValidator,
    auth,
    authorizeRoles(Roles.ADMIN),
    updateUserRole
  )
  .delete(objectIdValidator, auth, authorizeRoles(Roles.ADMIN), deleteUser);

module.exports = router;
