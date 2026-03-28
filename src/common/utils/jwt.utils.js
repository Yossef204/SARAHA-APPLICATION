import jwt from "jsonwebtoken";


export function signToken(payload,secret,options){
    return jwt.sign(payload,secret,options);
}

export function verifyToken(payload,secret){
    return jwt.verify(payload,secret);
}

export function generateTokens(payload) {
  const accessToken = signToken(
    payload,
    process.env.SECRET_KEY_TOKENS,
    { expiresIn: 60 },
  );
  //refresh tokens
  const refreshToken = signToken(
    payload,
    process.env.SECRET_KEY_REFRESH_TOKENS,
    { expiresIn: "1y" },
  );

  return {accessToken,refreshToken};
}
