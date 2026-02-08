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
    from: `"MoviePoint" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "MoviePoint • OTP Verification",
    html: `
      <div style="
        margin: 0;
        padding: 0;
        background-color: #0f0f0f;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 480px;
          margin: 40px auto;
          background-color: #141414;
          border-radius: 12px;
          padding: 28px;
          color: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        ">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="
              margin: 0;
              font-size: 26px;
              font-weight: 700;
              color: #e50914;
              letter-spacing: 1px;
            ">
              MoviePoint
            </h1>
            <p style="
              margin-top: 6px;
              font-size: 13px;
              color: #b3b3b3;
            ">
              Your movie journey starts here 🍿
            </p>
          </div>

          <div style="text-align: center;">
            <p style="
              font-size: 15px;
              color: #e5e5e5;
              margin-bottom: 18px;
            ">
              Use the OTP below to verify your email address
            </p>

            <div style="
              display: inline-block;
              padding: 14px 28px;
              background-color: #000000;
              border-radius: 8px;
              border: 1px solid #2a2a2a;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 6px;
              color: #ffffff;
              margin-bottom: 20px;
            ">
              ${otp}
            </div>

            <p style="
              font-size: 13px;
              color: #9ca3af;
              margin-bottom: 6px;
            ">
              This OTP is valid for <strong>10 minutes</strong>
            </p>

            <p style="
              font-size: 12px;
              color: #6b7280;
            ">
              If you didn’t request this, you can safely ignore this email.
            </p>
          </div>

          <div style="
            margin-top: 26px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            border-top: 1px solid #262626;
            padding-top: 14px;
          ">
            © ${new Date().getFullYear()} MoviePoint. All rights reserved.
          </div>
        </div>
      </div>
    `,
  });
};
