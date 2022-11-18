
const jwt = require("jsonwebtoken");

const getJwtToken = async function (user) {
  let params = {
    id: user._id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isAdmin: user.isAdmin,
  };

  var tokenValue = jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return tokenValue;
};

module.exports = getJwtToken;
