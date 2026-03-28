import { Router } from "express";
import { checkUserExist } from "./user.service.js";
import {
  BadRequestException,
  decrypt,
  SYS_MESSAGE,
  verifyToken,
} from "../../common/index.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";


const router = Router();

//get profile by id
router.get("/",isAuthenticated, async (req, res, next) => {
  const {user} = req;
  //if phone decrypt
  if (user.phone) {
    user.phone = decrypt(user.phone);
  }
  //return response
  return res
    .status(200)
    .json({
      mesage: SYS_MESSAGE.user.alreadyExists,
      success: true,
      data: { user },
    });
});

export default router;
