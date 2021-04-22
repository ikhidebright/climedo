import Joi from "joi";

const dataPoints = Joi.object().keys({
  dataType: Joi.string()
    .required()
    .valid("selection", "text", "date", "number")
    .messages({
      "any.required": "Sorry, dataType is required",
    }),
  label: Joi.string().required().empty().messages({
    "any.required": "Sorry, label is required",
    "string.empty": "Sorry, label cannot be an empty field",
  }),
  description: Joi.string().required().min(10).messages({
    "any.required": "Sorry, One of the datapoints is missing a description",
    "string.min": "description is too short for a datapoint",
  }),
  placeholder: Joi.string()
    .when("dataType", {
      is: "text",
      then: Joi.string().required().messages({
        "any.required": `Placeholder is a required when datapoints contains an item with dataType as text`,
      }),
    })
    .allow(null)
    .optional(),
  options: Joi.array()
    .items(
      Joi.string().required().messages({
        "any.required": `datapoints options must contain only strings`,
      })
    )
    .when("dataType", {
      is: "selection",
      then: Joi.array().items(Joi.string()).required().messages({
        "any.required": `options is required when datapoint contains an item with dataType as selection`,
      }),
    })
    .allow(null)
    .optional(),
});

const tabsSchema = Joi.object({
  name: Joi.string().required().empty().messages({
    "any.required": "Sorry, name is required",
    "string.empty": "Sorry, name cannot be an empty field",
  }),
  description: Joi.string().required().empty().min(10).messages({
    "any.required": "Sorry, description is required",
    "string.min": "description is too short",
    "string.empty": "Sorry, description cannot be an empty field",
  }),
  dataPoints: Joi.array()
    .items(
      dataPoints.required().messages({
        "any.required": `datapoints must contain items and cannot be empty`,
      })
    )
    .required()
    .empty()
    .messages({
      "any.required": "Sorry, dataPoints is required",
      "string.empty": "Sorry, dataPoints cannot be an empty field",
      "string.empty": "Sorry, dataPoints cannot be an empty field",
    }),
});

export { tabsSchema };
