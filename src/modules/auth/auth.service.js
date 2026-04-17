import { OAuth2Client } from "google-auth-library";
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
import { client } from "../../DB/redis.connection.js";

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

  //create user into redis caching
  await client.set(email,JSON.stringify(body),{EX: 5 * 60});
  //when verifying created into db
  // return await createUser(body);
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
  const otpDoc = await client.get(`${email}:otp`);

  if (!otpDoc) {
    throw new BadRequestException("invalid otp");
  }
  if (otpDoc !== otp) {
    // let newAttemps = otpDoc.attemps + 1;
    // if (newAttemps >= 5) {
    //   await client.del(`${email}:otp`);
    //   throw new BadRequestException(
    //     "too many attempts , please request new otp",
    //   );
    // }
    // await otpRepo.update({ _id: otpDoc._id }, { attemps: newAttemps });
    throw new BadRequestException("invalid otp");
  }

  //update user isEmailVerified to true
  // create user data from redis data
  const data = await client.get(email);
  await UserRepo.create(JSON.parse(data));
  await UserRepo.update({ email }, { isEmailVerified: true });
  await client.del(email);
  await client.del(`${email}:otp`);
  //delete otp from database


  return true;
};

export async function sendOtp(body) {
  const { email } = body;
  //otp in redis
  const otpDoc = await client.get(`${email}:otp`)
  if (otpDoc) {
    await client.del(`${email}:otp`);
    throw new BadRequestException(
      "otp already sent to this email , please check your email or wait for 1 minute to resend otp",
    );
  }
  //create otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //store in redis database
  await client.set(`${email}:otp`, otp, { EX: 60 });
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

export const logoutFromSpecificDevice = async (tokenPayload, user) => {
  tokenRepo.create({
    token: tokenPayload.jti,
    userId: user._id,
    expiresAt: new Date(tokenPayload.exp * 1000), // convert to milliseconds
  });
};

async function verifyGoogleIdToken (idToken){
  const client = new OAuth2Client(
    "1017666843386-2mgiibtn41msujre40a0mnof631s2jqb.apps.googleusercontent.com",
  );

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience:
      "1017666843386-2mgiibtn41msujre40a0mnof631s2jqb.apps.googleusercontent.com",
  });

  return ticket.getPayload();
};
export const loginWithGoogle = async (idToken) => {
  //verify id token
  const payload = await verifyGoogleIdToken(idToken);
  //check if user exist
  const user = await UserRepo.getOne({ email: payload.email });
  if (payload.email_verified === false) {
    throw new BadRequestException("email not verified by google");
  }
  //if user not exist create new user
  if (!user) {
    const createdUser = UserRepo.create({
      email: payload.email,
      userName: payload.name,
      profilePicture: payload.picture,
      provider: "google",
      isEmailVerified: true,
    });
    return generateTokens({
      sub: createUser._id,
      role: createdUser.role,
      gender: createdUser.gender,
      email: createdUser.email,
      provider: createdUser.provider,
    });
  }
};
