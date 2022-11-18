const Joi = require("joi");
const { ObjectID } = require("mongodb");

const ObjectIDCustomValidator = Joi.custom((value, helper) => {
  if (!ObjectID.isValid(value)) {
    return helper.message(
      `No Record with given ID Please Check The Value ${value}`
    );
  }
  return value;
});

module.exports = ObjectIDCustomValidator;
