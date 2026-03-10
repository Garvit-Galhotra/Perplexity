import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required "],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true, // removing accidental spaces
      default: "New Chat",
    },
  },
  { timestamps: true },
);

const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;
