import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";

connectDB();

testAi();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
