import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Movie Point" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Movie Point - OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Movie Point</h2>
        <p>Your OTP for registration is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });
};
