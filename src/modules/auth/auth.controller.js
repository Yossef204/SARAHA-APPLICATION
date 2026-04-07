import { Router } from "express";
import { checkUserExist, createUser } from "../user/user.service.js";
import {
  BadRequestException,
  compare,
  ConflictException,
  encrypt,
  fileUpload,
  generateTokens,
  hash,
  NotFoundException,
  SYS_GENDER,
  SYS_MESSAGE,
  SYS_ROLE,
  verifyToken,
} from "../../common/index.js";
import joi from "joi";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { login, logout, logoutFromSpecificDevice, sendOtp, signup, verifyAccount } from "./auth.service.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";

const router = Router();

router.post(
  "/signup",
  // file upload caling is object then call (none,single,array,any) to return middleware which parsing form data body
  fileUpload().none(),
  isValid(signupSchema),
  async (req, res, next) => {
    // create user
    const createdUser = await signup(req.body);
    return res.status(201).json({
      success: true,
      message: SYS_MESSAGE.user.createdSuccessfully,
      data: { createdUser },
    });
  },
);

router.post(
  "/login",
  fileUpload().none(), // parse form data from body
  isValid(loginSchema),
  async (req, res, next) => {
    const { accessToken, refreshToken } = await login(req.body);
    //if yes login
    return res.status(200).json({
      message: "login successfully",
      success: true,
      data: { accessToken, refreshToken },
    });
  },
);

router.get("/refresh-token", (req, res, next) => {
  const { authorization } = req.headers;
  const payload = verifyToken(
    authorization,
    process.env.SECRET_KEY_REFRESH_TOKENS,
  );
  delete payload.iat;
  delete payload.exp;

  const { accessToken, refreshToken } = generateTokens(payload);

  return res.status(200).json({
    message: "token refreshed successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
});

router.patch("/verify-account", fileUpload().none(), async (req, res, next) => {
  await verifyAccount(req.body);
  return res.status(200).json({
    message: "account verified successfully",
    success: true,
  });
});

router.post("/send-otp",fileUpload().none(), async (req, res, next) => {
  await sendOtp(req.body);
  return res
    .status(201)
    .json({
      success: true,
      message: { otp: "otp sent successfully to your email" },
    });
});

router.patch("/logout-from-all-devices",isAuthenticated, async (req, res, next) => {
  await logout(req.user);
  return res
    .status(200)
    .json({
      success: true,
      message: { logout: "logged out from all devices successfully" },
    });
});



router.post("/logout",isAuthenticated, async (req, res, next) => {
  await logoutFromSpecificDevice(req.payload, req.user);
  return res
    .status(200)
    .json({
      success: true,
      message: { logout: "logged out successfully" },
    });
});
export default router;
