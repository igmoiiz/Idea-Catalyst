const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "Idea Catalyst <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p style="color: #555; font-size: 16px;">You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FFBA00; color: #0C3B2E; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #555; font-size: 14px;">This link is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">© ${new Date().getFullYear()} Idea Catalyst. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
};
