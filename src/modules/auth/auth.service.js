import {
  BadRequestException,
  compare,
  ConflictException,
  encrypt,
  generateTokens,
  hash,
  sendMail,
  SYS_MESSAGE,
  SYS_ROLE,
} from "../../common/index.js";
import { UserRepo } from "../../DB/index.js";
import { otpRepo } from "../../DB/models/otp/otp.repository.js";
import { tokenRepo } from "../../DB/models/tokens/tokens.repository.js";
import { checkUserExist, createUser } from "../user/user.service.js";

export const signup = async (body) => {
  //destructing body
  const { email, phone } = body;
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
  body.role = SYS_ROLE.user;
  body.password = await hash(body.password);
  if (body.phone) {
    body.phone = encrypt(body.phone);
  }
  await sendOtp(body);

  return await createUser(body);
};

export const login = async (body) => {
  //destruct
  const { email, password } = body;
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
  return { accessToken, refreshToken };
};

export const verifyAccount = async (body) => {
  const { email, otp } = body;
  //check if otp is correct
  const otpDoc = await otpRepo.getOne({ email });

  if (!otpDoc) {
    throw new BadRequestException("invalid otp");
  }
  if (otpDoc.otp !== otp) {
    let newAttemps = otpDoc.attemps + 1;
    if (newAttemps >= 5) {
      await otpRepo.deleteOne({ _id: otpDoc._id });
      throw new BadRequestException(
        "too many attempts , please request new otp",
      );
    }
    await otpRepo.update({ _id: otpDoc._id }, { attemps: newAttemps });
    throw new BadRequestException("invalid otp");
  }

  //update user isEmailVerified to true
  await UserRepo.update({ email }, { isEmailVerified: true });
  //delete otp from database
  await otpRepo.deleteOne({ _id: otpDoc._id });

  return true;
};

export async function sendOtp(body) {
  const { email } = body;
  //otp
  const otpDoc = await otpRepo.getOne({ email });
  if (otpDoc) {
    throw new BadRequestException(
      "otp already sent to this email , please check your email or wait for 1 minute to resend otp",
    );
  }
  //create otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  //store in database
  await otpRepo.create({ email, otp, expires: Date.now() + 1 * 60 * 1000 });
  //send otp to user email
  await sendMail({
    to: email,
    subject: "verify your account",
    html: `
  <h2>Verify Your Account</h2>
  <p>Your OTP is:</p>
  <h1>${otp}</h1>
  <p>This code expires in 1 minute</p>
`,
  });
}

export const logout = async (user) => {
  await UserRepo.update(
    { _id: user._id },
    { credentialsUpdatedAt: Date.now() },
  );
  return true;
};

export const logoutFromSpecificDevice = async (tokenPayload , user) =>{
  tokenRepo.create({
    token : tokenPayload.jti ,
    userId : user._id ,
    expiresAt : new Date(tokenPayload.exp * 1000) // convert to milliseconds
  })
}
