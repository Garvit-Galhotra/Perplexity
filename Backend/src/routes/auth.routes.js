import Router from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

import authUser from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */

authRouter.post("/register", registerValidator, registerUser);

authRouter.post("/login", loginValidator, loginUser);

authRouter.get("/get-me", authUser, getMe);

authRouter.get("/verify-email", verifyEmail);

export default authRouter;
