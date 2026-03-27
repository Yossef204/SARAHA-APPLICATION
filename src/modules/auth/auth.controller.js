import { Router } from "express";
import { checkUserExist, createUser } from "../user/user.service.js";
import {
  BadRequestException,
  compare,
  ConflictException,
  encrypt,
  hash,
  NotFoundException,
  SYS_MESSAGE,
  SYS_ROLE,
} from "../../common/index.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/signup", async (req, res, next) => {
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
  req.body.password = await hash(req.body.password)
  if(req.body.phone){
    req.body.phone = encrypt(phone)
  }
  //create user
  const createdUser = await createUser(req.body);
  return res.status(201).json({
    success: true,
    message: SYS_MESSAGE.user.createdSuccessfully,
    data: { createdUser },
  });
});

router.post("/login", async (req, res, next) => {
  //destruct
  const { email, password } = req.body;
  //check user exist
  const user = await checkUserExist({
    email: { $eq: email, $exists: true, $ne: null },
  });
  //check password
  const match = await compare(password, user?.password || "11ljklhiilgdtkhjhhuoino");
  if (!user||!match) {
    throw new BadRequestException("invalid credentials");
  }
  //exclude password from response 
  user.password = undefined; 
  //if yes login
  return res
    .status(200)
    .json({ message: "login successfully", success: true, data: { user } });
});

export default router;
