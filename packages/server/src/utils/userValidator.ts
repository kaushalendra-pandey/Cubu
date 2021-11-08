import * as yup from "yup";

export const emailNotLongEnough = "Email must be at least 3 characters";
export const passwordNotLongEnough = "Password must be at least 3 characters";
export const invalidEmail = "Email must be a valid email";

export const registerPasswordValidation = yup
  .string()
  .min(3, passwordNotLongEnough)
  .max(255)
  .required();

export const validUserSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail)
    .required(),
  password: registerPasswordValidation
});

const invalidLogin = "Invalid Credentials";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, invalidLogin)
    .max(255, invalidLogin)
    .email(invalidLogin)
    .required(),
  password: yup
    .string()
    .min(3, invalidLogin)
    .max(255, invalidLogin)
    .required()
});

export const changePasswordSchema = yup.object().shape({
  newPassword: registerPasswordValidation
});