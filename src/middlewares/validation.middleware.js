import { BadRequestException, SYS_GENDER, SYS_ROLE } from "../common/index.js";
import joi from "joi";

export const isValid = (schema) => {
  return (req, res, next) => {
    //layer of validation
    const resultValidation = schema.validate(req.body, {
      abortEarly: false,
    });
    if (resultValidation.error) {
      const errors = resultValidation.error.details.map((err) => {
        return {
          message: err.message,
          field: err.path[0],
        };
      });
      throw new BadRequestException("invalid data", errors);
    }
    next();
  };
};

export const generalFields = {
  userName: joi.string().required().min(2).max(20).trim(),
  email: joi.string().email().messages({
    "string.pattern.base":
      "email must be a valid email address from gmail, yahoo domains",
  }),
  phone: joi
    .string()
    .pattern(/^01[0125]{1}[0-9]{8}$/)
    .messages({
      "string.pattern.base": "phone must be a valid Egyptian phone number",
    }),
  gender: joi
    .number()
    .valid(...Object.values(SYS_GENDER))
    .default(SYS_GENDER.male)
    .messages({
      number: "gender must be a valid gender value",
    }),
  role: joi
    .number()
    .valid(...Object.values(SYS_ROLE))
    .default(SYS_ROLE.user)
    .messages({
      number: "role must be a valid role value",
    }),
  password: joi
    .string()
    .pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)
    .required()
    .messages({
      "string.pattern.base":
        "password must be 8-16 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
  rePassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "repassword must match password",
  }),
};
