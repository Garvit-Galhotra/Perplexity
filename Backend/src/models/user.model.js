import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required for user"],
      unique: [true, "username must be unique"],
    },
    email: {
      type: String,
      required: [true, "email is required for user"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required for user"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePasswords = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("users", userSchema);

export default userModel;
