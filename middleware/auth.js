const User = require("../models/User.Model");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor.Model");

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next("Please Login for access this resource", 401);
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);

  const findTable = decodeData.isAdmin ? User : Doctor;

  const user = await findTable.findById(decodeData.id);

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User Not Found",
    });
  }

  req.user = user;

  console.log("decodeData", decodeData);
  console.log("user in request", req.user);

  next();
};

// Admin Roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.isAdmin)) {
      return next(`${req.user.isAdmin} cannot the access this resource`, 403);
    }
    next();
  };
};

module.exports = { auth, authorizeRoles };
