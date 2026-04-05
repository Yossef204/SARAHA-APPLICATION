import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { BadRequestException } from "../common/index.js";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = async (req, res, next) => {

    // get the file path
    const filePath = req.file.path;
    // read the file and return buffer
    const buffer = fs.readFileSync(filePath);
    // get the file type
    const type = await fileTypeFromBuffer(buffer);
    // validate
    const allowedTypes = ["image/jpeg", "image/png","image/jpg", "image/gif"];
    if (!type || !allowedTypes.includes(type.mime)){
        fs.unlinkSync(filePath); // delete the file
        throw new BadRequestException("invalid file type");
    }
    return next();
};