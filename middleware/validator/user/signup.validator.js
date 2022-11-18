const { celebrate, Joi, Segments } = require("celebrate");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const nameValidationSchema = Joi.string().min(1);

const passwordValidationSchema = joiPassword
  .string()
  .not(null)
  .minOfSpecialCharacters(1)
  .minOfNumeric(1)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .min(8)
  .max(20)
  .noWhiteSpaces()
  .messages({
    "password.minOfUppercase":
      "{#label} should contain at least {#min} uppercase character",
    "password.minOfSpecialCharacters":
      "{#label} should contain at least {#min} special character",
    "password.minOfLowercase":
      "{#label} should contain at least {#min} lowercase character",
    "password.minOfNumeric":
      "{#label} should contain at least {#min} numeric character",
    "password.noWhiteSpaces": "{#label} should not contain white spaces",
  });

const emailValidationSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "in"] },
  })
  .trim(true)
  .lowercase();

const phoneNumberValidationSchema = Joi.string().length(10);

const picValidationSchema = Joi.string().default(
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
);

const addressValidation = Joi.object({
  street1: Joi.string().min(1).required(),
  street2: Joi.string().min(1).required(),
  country: Joi.string().min(1).required(),
  state: Joi.string().min(1).required(),
  pin: Joi.number().min(1).required(),
});

const userSignUP = celebrate(
  {
    [Segments.BODY]: {
      name: nameValidationSchema.required(),
      email: emailValidationSchema.required(),
      password: passwordValidationSchema.required(),
      phoneNumber: phoneNumberValidationSchema.required(),
      pic: picValidationSchema,
      address: addressValidation,
    },
  },
  { abortEarly: false }
);

module.exports = {
  userSignUP,
  nameValidationSchema,
  emailValidationSchema,
  passwordValidationSchema,
  phoneNumberValidationSchema,
  picValidationSchema,
};
