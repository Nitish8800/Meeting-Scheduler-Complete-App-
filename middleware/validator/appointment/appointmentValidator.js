const { celebrate, Joi, Segments } = require("celebrate");
const ObjectIDCustomValidator = require("../../../utils/objectIdCustomValidator");
const { phoneNumberValidationSchema } = require("../user/userUpdate.validator");

const descriptionValidationSchema = Joi.string().trim().max(200);

const statusValidationSchema = Joi.string().valid(
  "seen",
  "confirm",
  "rejected",
  "finished"
);
const appointmentTimeValidationSchema = Joi.string().isoDate();

const createAppointmentValidation = celebrate(
  {
    [Segments.BODY]: {
      appointmentTime: appointmentTimeValidationSchema.required(),
      description: descriptionValidationSchema.required(),
      phoneNumber: phoneNumberValidationSchema.required(),
      status: statusValidationSchema,
      patient: ObjectIDCustomValidator.required(),
      doctor: ObjectIDCustomValidator.required(),
    },
  },
  { abortEarly: false }
);


const appointmentUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      appointmentTime: appointmentTimeValidationSchema,
      description: descriptionValidationSchema,
      phoneNumber: phoneNumberValidationSchema,
      status: statusValidationSchema,
      patient: ObjectIDCustomValidator,
      doctor: ObjectIDCustomValidator,
    },
  },
  { abortEarly: false }
);

module.exports = {
  createAppointmentValidation,
  appointmentUpdateValidation,
};
