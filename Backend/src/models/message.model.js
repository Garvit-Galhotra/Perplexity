import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: [true, "chatId is required"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
    },

    role: {
      type: String,
      enum: ["user", "ai"],
      required: [true, "Role is required "],
    },
  },
  { timestamps: true },
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
