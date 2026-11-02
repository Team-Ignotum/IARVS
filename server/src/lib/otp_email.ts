import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

export async function sendOTPEmail(
  email: string,
  code: string,
  purpose: "LOGIN" | "RESET",
) {
  const subject =
    purpose === "LOGIN"
      ? "IARVS - Login Verification"
      : "IARVS - Password Reset";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject,
    text: `Your IARVS verification code is ${code}.
It expires in 5 minutes.
Do not share this code with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;
                  max-width:480px;margin:auto">
        <h2>IARVS Verification</h2>
        <p>Use this one-time verification code:</p>
        <h1 style="letter-spacing:8px">${code}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this code,
           you can ignore this email.</p>
      </div>
    `,
  });
}
