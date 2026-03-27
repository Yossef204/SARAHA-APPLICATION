import crypto from "node:crypto";

export function encrypt(text) {
  const iv = crypto.randomBytes(16); //16*2 =32
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    //256 = 8 bytes * 32 length of key
    Buffer.from(process.env.SECRET_KEY_ENCRYPTION), // key is string but should be buffer
    iv,
  );
  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedData}`; // converted to string because iv is buffer in hex encoding
}

export function decrypt(encText) {
  const [iv, encValue] = encText.split(":");
  const ivBufferLike = Buffer.from(iv, "hex");
  const deCipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SECRET_KEY_ENCRYPTION),
    ivBufferLike,
  );
  let deCryptedData = deCipher.update(encValue, "hex", "utf-8");
  deCryptedData += deCipher.final("utf-8");

  return deCryptedData;
}
