import { model, Schema } from "mongoose";
const schema = new Schema({
  otp: { type: String, required: true },
  email: { type: String, required: true },
  attemps: { type: Number, default: 0 },
  expires: { type: Date, index: { expires: 0 } },
});
export const otp = model("otp", schema);
