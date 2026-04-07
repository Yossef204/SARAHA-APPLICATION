import { model, Schema } from "mongoose";

const schema = new Schema({
  token: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, index: { expires: 0 } },
});
export const token = model("tokens", schema);
