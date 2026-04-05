import { Router } from "express";
import { checkUserExist, uploadpic } from "./user.service.js";
import {
  BadRequestException,
  decrypt,
  fileUpload,
  SYS_MESSAGE,
  verifyToken,
} from "../../common/index.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { fileValidation } from "../../middlewares/file-validation.middleware.js";

const router = Router();

//get profile by id
router.get("/", isAuthenticated, async (req, res, next) => {
  const { user } = req;
  //if phone decrypt
  if (user.phone) {
    user.phone = decrypt(user.phone);
  }
  //return response
  return res.status(200).json({
    mesage: SYS_MESSAGE.user.alreadyExists,
    success: true,
    data: { user },
  });
});

router.patch(
  "/upload-profile-picture",
  isAuthenticated,
  fileUpload().single("pp"), // parse form data from body and get file from key pp
  fileValidation, // validate file type by magic number
  async (req,res,next) => {
    const updatedUser = await uploadpic(req.user, req.file);
    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      success: true,
      data: { updatedUser },
    });
  },
);

export default router;
