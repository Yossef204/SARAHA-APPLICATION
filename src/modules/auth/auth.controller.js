import { Router } from "express";
import { checkUserExist, createUser } from "../user/user.service.js";
import { ConflictException, SYS_MESSAGE } from "../../common/index.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  //destructing body
  const { userName, email, password, phone, role, gender } = req.body;
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
  //create user
  const createdUser = await createUser({
    userName,
    email,
    password,
    phone,
    role,
    gender,
  });
  return res
    .status(201)
    .json({
      success: true,
      message: SYS_MESSAGE.user.createdSuccessfully,
      data: { user: createdUser },
    });

});

export default router;
