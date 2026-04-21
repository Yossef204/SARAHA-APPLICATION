import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 500,
      trim: true,
      required: function () {
        if (this.attachment.length === 0) {
          return true;
        }
        return false;
      },
    },
    attachment: {
        type: [String],
        required: function () {
            if (this.content) return false;
            return true;
        },
    },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    reciever : { type: Schema.Types.ObjectId, ref: "User",required : true },
  },
  {
    timestamps: true,
  },
);

export const Message = model("Message", schema);
