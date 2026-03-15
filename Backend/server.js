import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

connectDB();

const httpServer = http.createServer(app);
initSocket(httpServer);
httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
});
