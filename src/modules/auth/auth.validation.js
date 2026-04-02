import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const signupSchema = joi
  .object({
    userName: generalFields.userName,
    email: generalFields.email,
    phone: generalFields.phone,
    gender: generalFields.gender,
    role: generalFields.role,
    password: generalFields.password,
    rePassword: generalFields.rePassword
  })
  .or("email", "phone")
  .required();

export const loginSchema = joi
  .object({
    email: generalFields.email,
    phone: generalFields.phone,
    password: generalFields.password,
  })
  .or("email", "phone")
  .required();
