import pkg from "bcryptjs";
export async function hash(password) {
  return await pkg.hash(password, 12);
}
export async function compare(pass, hashed) {
  return pkg.compare(pass, hashed);
}
