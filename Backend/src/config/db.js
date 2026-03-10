import mongoose from "mongoose";

function connectDB() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("server is connected to db");
  });
}

export default connectDB;
