const User = require("../../models/User.Model");
const Doctor = require("../../models/Doctor.Model");
const controller = require("../../config/controller/controller");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");
const getJwtToken = require("../../utils/getJwtToken");

// Get User Details
const getUserDetails = controller(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }
  res
    .status(200)
    .send({ success: true, message: "Get Single User Details", data: user });
});

// Register New User
const createUser = controller(async (req, res) => {
  let { name, email, password, phoneNumber, address } = req.body;
  let user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    address,
  });

  let token = await user.getJwtToken;

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.cookie();

  if (req.file !== undefined) {
    user.pic = "/user/" + req.file.filename;
  }

  await user.save();

  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    data: user,
  });
});

// Login User , Admin and Doctor
const loginUser = controller(async (req, res) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });
  const doctor = await Doctor.findOne({ email });
  if (!user && !doctor) {
    return res.status(400).send({
      success: false,
      message: "Not Found",
    });
  }

  const match = await bcrypt.compare(
    password,
    user?.password || doctor?.password
  );

  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Password is wrong",
    });
  }

  const token = await getJwtToken(user || doctor);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  let loggedInUser;
  if (user) {
    loggedInUser = { user };
  } else {
    loggedInUser = { doctor };
  }

  res.status(200).send({
    success: true,
    message: "Login Successfully",
    ...loggedInUser,
    token: { accessToken: token, expiresIn: process.env.JWT_EXPIRES },
  });
});

// Update User
const updateUser = controller(async (req, res) => {
  let user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User Not Found",
    });
  }
  req.body.address = { ...user.address, ...(req.body.address || {}) };

  Object.entries(req.body).forEach(([key, value]) => {
    user[key] = value;
  });

  if (req.file) {
    user.pic = "/user/" + req.file.filename;
  }

  const updatedUser = await user.save();

  console.log("updated user", updatedUser);

  res.status(200).send({
    success: true,
    message: "User Updated successfully",
    data: updatedUser,
  });
});

// Log Out User
const logOutUser = controller(async (req, res) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({ success: true, message: " Log Out Successfully" });
});

// Get All users
const getAllUser = controller(async (req, res) => {
  let data = await User.find();
  res.status(200).send({
    success: true,
    message: "All User Get Successfully",
    data: data,
  });
});

// Get Single User
const getSingleUser = controller(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "Single User Get Successfully",
    data: user,
  });
});

// Delete user
const deleteUser = controller(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }

  res.status(200).send({
    success: true,
    message: "User deleted succesfully",
  });
});

// Update user by admin
const updateUserRole = controller(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id);
  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }
  req.body.address = { ...user.address, ...(req.body.address || {}) };
  Object.entries(req.body).forEach(([key, value]) => {
    user[key] = value;
  });

  if (req.file) {
    user.pic = "/user/" + req.file.filename;
  }

  const updatedUser = await user.save();
  res.status(200).send({
    success: true,
    message: "User Updated successfully",
    data: updatedUser,
  });
});

// Update Password
const updatePassword = controller(async (req, res) => {
  let { oldPassword } = req.body;

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).send({
      success: false,
      message: "Confirm Password not matched",
    });
  }

  const user = await User.findById(req.user.id);
  const doctor = await Doctor.findById(req.user.id);

  if (!user && !doctor) {
    return res.status(400).send({
      success: false,
      message: "Not Found",
    });
  }

  const match = await bcrypt.compare(
    oldPassword,
    user?.password || doctor?.password
  );

  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Old Password is incorrect",
    });
  }

  const loggedInUser = user ? user : doctor;
  loggedInUser.password = req.body.newPassword;
  await loggedInUser.save();

  res.status(200).send({
    success: true,
    message: "Password Updated Successfully",
    data: loggedInUser,
  });
});

module.exports = {
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
};
