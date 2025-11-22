import nodemailer from 'nodemailer';

// Configure the transporter using environment variables.
// Make sure to set EMAIL_USER and EMAIL_PASS in your .env file.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a password reset email containing the new password.
 * @param {string} to - The recipient's email address.
 * @param {string} newPassword - The new temporary password.
 */
export const sendPasswordResetEmail = async (to, newPassword) => {
    const mailOptions = {
        from: `"Naveen Associates" <${process.env.EMAIL_USER}>`,
        to: 'rohits@naveenassociatesgroup.com',
        subject: 'Your Password Has Been Reset',
        html: `
      <p>Hello,</p>
      <p>Your password has been reset. Your new password is:</p>
      <p><b>${newPassword}</b></p>
      <p>Please log in with your new password.</p>
      <p>Thank you,<br/>The Naveen Associates Team</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${to}:`, error);
    }
};

/**
 * Sends a notification email with the details from a new contact inquiry.
 * @param {object} userDetails - The details submitted from the contact form.
 */
export const sendContactInquiry = async (userDetails) => {
    const adminEmail = 'rohits@naveenassociatesgroup.com';
    const mailOptions = {
        from: `"Website Inquiry" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `New Contact Inquiry: ${userDetails.subject}`,
        html: `
      <h3>You have a new contact inquiry:</h3>
      <ul>
        <li><b>Name:</b> ${userDetails.name}</li>
        <li><b>Email:</b> ${userDetails.email}</li>
        <li><b>Phone:</b> ${userDetails.phoneNumber}</li>
        <li><b>Subject:</b> ${userDetails.subject}</li>
        <li><b>Message:</b><br/>${userDetails.Message}</li>
      </ul>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact inquiry sent to ${adminEmail}`);
    } catch (error) {
        console.error('Error sending contact inquiry email:', error);
    }
};