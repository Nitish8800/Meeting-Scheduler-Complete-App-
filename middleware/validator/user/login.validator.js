const { celebrate, Joi, Segments } = require("celebrate");
const { emailValidationSchema } = require("./signup.validator");

const validateUserLogin = celebrate(
  {
    [Segments.BODY]: {
      email: emailValidationSchema.required(),
      password: Joi.string().required(),
    },
  },
  { abortEarly: false }
);

module.exports = { validateUserLogin };
