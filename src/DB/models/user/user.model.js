import { model, Schema } from "mongoose";
import { SYS_GENDER, SYS_ROLE } from "../../../common/index.js";

const schema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: [3, "minimum length must be greater than 3 "],
      maxLength: 20,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    provider: { type: String, enum: ["system", "google"], default: "system" },
    password: {
      type: String,
      required: function () {
        return this.provider === "system";
      },
      minLength: 8,
    },
    gender: {
      type: Number,
      enum: Object.values(SYS_GENDER),
      default: SYS_GENDER.male,
    },
    role: {
      type: Number,
      enum: {
        values: Object.values(SYS_ROLE),
        message: "gender must be 0 or 1 , 0 for male , 1 for female",
      },
      default: SYS_ROLE.user,
    },
    phone: {
      type: String,
      required: function () {
        return this.email ? false : true;
      },
    },
    profilePicture: String,
    isEmailVerified: { type: Boolean, default: false },
    credentialsUpdatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  },
);
export const User = model("User", schema);
