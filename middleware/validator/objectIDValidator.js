const { Joi, celebrate, Segments } = require("celebrate");
const ObjectIDCustomValidator = require("../../utils/objectIdCustomValidator");

const objectIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: ObjectIDCustomValidator,
  }),
});

module.exports = objectIdValidator;
