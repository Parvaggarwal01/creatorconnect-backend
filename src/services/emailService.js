import nodemailer from 'nodemailer';

const createTransporter = async () => {
  // Use Ethereal for testing or Gmail for production
  if (process.env.EMAIL_SERVICE === 'ethereal') {
    // Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Gmail or other service
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

const sendOTPEmail = async (email, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"CreatorConnect" <${process.env.EMAIL_USER || 'noreply@creatorconnect.com'}>`,
    to: email,
    subject: 'Your OTP for CreatorConnect Signup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Thank you for signing up with CreatorConnect!</p>
        <p>Your OTP code is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">This code will expire in 5 minutes.</p>
        <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  // Log preview URL for Ethereal
  if (process.env.EMAIL_SERVICE === 'ethereal') {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

const sendWelcomeEmail = async (email, name) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"CreatorConnect" <${process.env.EMAIL_USER || 'noreply@creatorconnect.com'}>`,
    to: email,
    subject: 'Welcome to CreatorConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome, ${name}!</h2>
        <p>Your account has been successfully created.</p>
        <p>We're excited to have you on board!</p>
        <p>Start exploring and connecting with creators today.</p>
        <p style="color: #666; margin-top: 30px;">Best regards,<br>The CreatorConnect Team</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  // Log preview URL for Ethereal
  if (process.env.EMAIL_SERVICE === 'ethereal') {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
};
