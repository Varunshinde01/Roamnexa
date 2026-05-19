import nodemailer from 'nodemailer';

let transporter;

// Create transporter dynamically based on .env config or fallback test account
export const getTransporter = async () => {
  if (transporter) return transporter;

  const isConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (isConfigured) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✅ Email service loaded via live SMTP configurations.');
  } else {
    // Generate Ethereal testing account automatically for clean demonstration fallback!
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📬 Live SMTP credentials not found. Using Ethereal Test SMTP.');
      console.log(`🧪 Test Inbox Username: ${testAccount.user}`);
    } catch (err) {
      console.error('❌ Failed to create test mail account on-the-fly:', err.message);
    }
  }

  return transporter;
};

// Send account creation confirmation email
export const sendConfirmationEmail = async (userEmail, userName) => {
  try {
    const client = await getTransporter();
    if (!client) {
      console.log('⚠️ Email client not initialized. Skipping email.');
      return;
    }

    const isTest = !process.env.SMTP_USER || !process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_USER || '"Roamnexa Travel" <noreply@roamnexa.com>';

    const info = await client.sendMail({
      from: fromAddress,
      to: userEmail,
      subject: '✈️ Welcome to Roamnexa! Confirm Your Account Creation',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(15,23,42,0.03);">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Roamnexa</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your AI-Powered Travel Concierge</p>
          </div>
          
          <div style="padding: 30px 10px;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Hi ${userName},</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              Welcome aboard! Your account on <strong>Roamnexa</strong> has been successfully created. You're now equipped with the ultimate suite of AI-driven travel planning and multi-modal booking tools.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0; border-radius: 8px;">
              <p style="margin: 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
                <strong>💡 Quick Tip:</strong> Click the floating ✨ <strong>AI Chatbot</strong> icon in the bottom right corner of the dashboard to start planning your next dream itinerary instantly!
              </p>
            </div>
            
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              No further action is required. We've automatically activated your <strong>Voygo Rewards</strong> profile so you can start earning travel points today.
            </p>
            
            <div style="text-align: center; margin: 35px 0 10px 0;">
              <a href="http://localhost:5173" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); display: inline-block;">Go to My Dashboard</a>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 25px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px;">
            <p style="margin: 0;">&copy; 2026 Roamnexa Inc. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This email is sent to confirm your sign-up verification.</p>
          </div>
        </div>
      `,
    });

    console.log(`✉️ Confirmation Email sent to: ${userEmail}`);
    if (isTest) {
      console.log(`🔗 [DEMO ONLY] View Test Email Inbox: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    console.error('❌ Failed to send registration email:', err.message);
  }
};
