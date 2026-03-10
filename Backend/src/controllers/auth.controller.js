import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(400).json({
      message: "user with this email or username already exists",
      success: false,
      err: "user already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
        <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User created successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
