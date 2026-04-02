import { Router } from "express";
import { checkUserExist, createUser } from "../user/user.service.js";
import {
  BadRequestException,
  compare,
  ConflictException,
  encrypt,
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



const router = Router();

router.post("/signup",isValid(signupSchema), async (req, res, next) => {

  //destructing body
  const { email, phone } = req.body;
  //check user exist
  const user = await checkUserExist({
    $or: [
      { email: { $eq: email, $exists: true, $ne: null } },
      { phone: { $eq: phone, $exists: true, $ne: null } },
    ],
  });
  //if user exist
  if (user) {
    throw new ConflictException(SYS_MESSAGE.user.alreadyExists);
  }
  //prepare data - hashing
  req.body.role = SYS_ROLE.user;
  req.body.password = await hash(req.body.password);
  if (req.body.phone) {
    req.body.phone = encrypt(phone);
  }
 // create user
  const createdUser = await createUser(req.body);
  return res.status(201).json({
    success: true,
    message: SYS_MESSAGE.user.createdSuccessfully,
    data: {createdUser},
  });
});

router.post("/login",isValid(loginSchema), async (req, res, next) => {

  //destruct
  const { email, password } = req.body;
  //check user exist
  const user = await checkUserExist({
    email: { $eq: email, $exists: true, $ne: null },
  });
  //check password
  const match = await compare(
    password,
    user?.password || "11ljklhiilgdtkhjhhuoino",
  );
  if (!user || !match) {
    throw new BadRequestException("invalid credentials");
  }
  //generate tokens
  const { accessToken, refreshToken } = generateTokens({
    sub: user._id,
    role: user.role,
    gender: user.gender,
    email: user.email,
  });
  //if yes login
  return res.status(200).json({
    message: "login successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
});

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
export default router;
