import { DBRepository } from "../../db.repository.js";
import { otp } from "./otp.model.js";

class OtpRepo extends DBRepository {
    constructor(){
        super(otp);
    }
}

export const otpRepo = new OtpRepo();