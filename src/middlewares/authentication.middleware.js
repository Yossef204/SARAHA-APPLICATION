import { BadRequestException, verifyToken } from "../common/index.js";
import { UserRepo } from "../DB/index.js";

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
  // inject user
  req.user = user ; 
  next();
};


