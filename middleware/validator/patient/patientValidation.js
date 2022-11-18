const { celebrate, Joi, Segments } = require("celebrate");

const userRelationshipValidationSchema = Joi.string().min(1);
const ageValidationSchema = Joi.number().min(1);

const heightValidationSchema = Joi.number().min(1);

const weightValidationSchema = Joi.number().min(1);

const createPatientValidation = celebrate(
  {
    [Segments.BODY]: {
      userRelationship: userRelationshipValidationSchema.required(),
      age: ageValidationSchema.required(),
      height: heightValidationSchema.required(),
      weight: weightValidationSchema.required(),
    },
  },
  { abortEarly: false }
);

const patientUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      userRelationship: userRelationshipValidationSchema,
      age: ageValidationSchema,
      height: heightValidationSchema,
      weight: weightValidationSchema,
    },
  },
  { abortEarly: false }
);

module.exports = {
  createPatientValidation,
  patientUpdateValidation,
};
