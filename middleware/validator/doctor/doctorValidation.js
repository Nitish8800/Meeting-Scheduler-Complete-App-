const { celebrate, Joi, Segments } = require("celebrate");
const {
  nameValidationSchema,
  emailValidationSchema,
  phoneNumberValidationSchema,
  addressValidation,
  passwordValidationSchema,
} = require("../user/userUpdate.validator");

const specialisationValidationSchema = Joi.string();

const feesValidationSchema = Joi.number();
const rolesValidationSchema = Joi.string();

const createDoctorValidation = celebrate(
  {
    [Segments.BODY]: {
      name: nameValidationSchema.required(),
      email: emailValidationSchema.required(),
      phoneNumber: phoneNumberValidationSchema.required(),
      address: addressValidation.required(),
      specialisation: specialisationValidationSchema.required(),
      fees: feesValidationSchema.required(),
      role: rolesValidationSchema,
    },
  },
  { abortEarly: false }
);

const doctorUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      name: nameValidationSchema,
      email: emailValidationSchema,
      phoneNumber: phoneNumberValidationSchema,
      password: passwordValidationSchema,
      address: addressValidation,
      specialisation: specialisationValidationSchema,
      fees: feesValidationSchema,
      role: rolesValidationSchema,
    },
  },
  { abortEarly: false }
);

module.exports = {
  createDoctorValidation,
  doctorUpdateValidation,
};
