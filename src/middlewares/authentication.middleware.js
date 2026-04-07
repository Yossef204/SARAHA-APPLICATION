import { BadRequestException, verifyToken } from "../common/index.js";
import { UserRepo } from "../DB/index.js";
import { tokenRepo } from "../DB/models/tokens/tokens.repository.js";

export const isAuthenticated = async (req, res, next) => {
  //get id from token from headers
  const { authorization } = req.headers;
  const payload = verifyToken(
    authorization,
    "yossefyossefmoyossefyossefmandeel",
  );

  const user = await UserRepo.getOne({ _id: payload.sub }); // {} | null
  if (!user) {
    throw new BadRequestException("invalid id");
  }

  //check if credentials updated after token issued
  if(user.credentialsUpdatedAt.getTime() > payload.iat * 1000)
  {
    throw new BadRequestException("invalid token");
  }

  //check if token is blacklisted
  const baockedTokens = await tokenRepo.getOne({ token: payload.jti });
  if (baockedTokens) {
    throw new BadRequestException("invalid token");
  }
  // inject user
  req.payload = payload ;
  req.user = user ; 
  next();
};


