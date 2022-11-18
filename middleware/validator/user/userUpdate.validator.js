const { celebrate, Joi, Segments } = require("celebrate");
const { picValidationSchema } = require("./signup.validator");
const {
  emailValidationSchema,
  passwordValidationSchema,
  nameValidationSchema,
  phoneNumberValidationSchema,
} = require("./signup.validator");

const ObjectIDCustomValidator = require("../../../utils/objectIdCustomValidator");

const addressValidation = Joi.object({
  street1: Joi.string().min(1),
  street2: Joi.string().min(1),
  country: Joi.string().min(1),
  state: Joi.string().min(1),
  pin: Joi.number().min(1),
});

const updateSchema = Joi.object({
  name: nameValidationSchema,
  email: emailValidationSchema,
  password: passwordValidationSchema,
  phoneNumber: phoneNumberValidationSchema,
  pic: picValidationSchema,
  address: addressValidation,
});

const updateSchemaWithRole = updateSchema.keys({
  isAdmin: Joi.string().valid("admin", "user"),
});

const userUpdateValidator = celebrate(
  {
    [Segments.BODY]: updateSchema,
  },
  { abortEarly: false }
);

const userUpdateRoleValidator = celebrate(
  {
    [Segments.BODY]: updateSchemaWithRole,
  },
  { abortEarly: false }
);

module.exports = {
  userUpdateValidator,
  userUpdateRoleValidator,
  nameValidationSchema,
  emailValidationSchema,
  phoneNumberValidationSchema,
  addressValidation,
  passwordValidationSchema,
};
