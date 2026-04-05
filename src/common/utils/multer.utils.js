import multer, { diskStorage } from "multer";
import fs from "node:fs";
import { BadRequestException } from "./error.utils.js";

export const fileUpload = (
  allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"],
) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new BadRequestException("invalid file type"), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (fs.existsSync(`uploads/${req.user._id}`)) {
          return cb(null, `uploads/${req.user._id}`);
        }
        fs.mkdirSync(`uploads/${req.user._id}`);
        cb(null, `uploads/${req.user._id}`);
      }, // string  or function
      filename: (req, file, cb) => {
        console.log({ file }); // information about the file
        cb(null, Date.now() + Math.random() + "__" + file.originalname); //act as next in middleware
      }, // function
    }),
  });
};
