const nodemailer = require('nodemailer');
const { User } = require('../models');

/**
 * Send welcome emails to all users
 * Run with: node backend/scripts/sendWelcomeEmails.js
 */

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailTemplate = (user, temporaryPassword) => {
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  return {
    subject: 'Welcome to Task Manager Pro',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Task Manager Pro! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name}!</h2>
            <p>Your account has been created successfully. You can now access the Task Manager system to manage your tasks and collaborate with your team.</p>
            
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Employee ID:</strong> ${user.employeeId}</p>
              ${temporaryPassword ? `<p><strong>Temporary Password:</strong> ${temporaryPassword}</p>` : ''}
              <p><strong>Role:</strong> ${user.role.toUpperCase()}</p>
            </div>

            <div style="text-align: center;">
              <a href="${loginUrl}/login" class="button">Login to Your Account</a>
            </div>

            ${temporaryPassword ? `
            <div class="warning">
              <strong>⚠️ Important Security Notice:</strong>
              <ul>
                <li>Please change your password immediately after your first login</li>
                <li>Do not share your credentials with anyone</li>
                <li>Use a strong, unique password</li>
              </ul>
            </div>
            ` : ''}

            <h3>Getting Started:</h3>
            <ol>
              <li>Log in using your credentials</li>
              <li>Complete your profile information</li>
              <li>Explore the dashboard and features</li>
              <li>Start managing your tasks!</li>
            </ol>

            <h3>Key Features:</h3>
            <ul>
              <li>📋 Task Management - Create, assign, and track tasks</li>
              <li>📅 Calendar View - Visualize deadlines and schedules</li>
              <li>👥 Team Collaboration - Work together seamlessly</li>
              <li>📊 Progress Tracking - Monitor task completion</li>
              <li>🔔 Real-time Notifications - Stay updated</li>
            </ul>

            <p>If you have any questions or need assistance, please contact your administrator.</p>

            <p>Best regards,<br>The Task Manager Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2026 Task Manager Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Task Manager Pro!

Hello ${user.name}!

Your account has been created successfully.

Login Credentials:
- Email: ${user.email}
- Employee ID: ${user.employeeId}
${temporaryPassword ? `- Temporary Password: ${temporaryPassword}` : ''}
- Role: ${user.role.toUpperCase()}

Login URL: ${loginUrl}/login

${temporaryPassword ? 'IMPORTANT: Please change your password immediately after your first login.' : ''}

If you have any questions, please contact your administrator.

Best regards,
The Task Manager Team
    `
  };
};

async function sendWelcomeEmails() {
  try {
    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Email configuration missing!');
      console.log('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
      process.exit(1);
    }

    console.log('🚀 Fetching users...\n');

    // Get all users
    const users = await User.findAll({
      where: { isActive: true }
    });

    if (users.length === 0) {
      console.log('No users found!');
      process.exit(0);
    }

    console.log(`Found ${users.length} users\n`);

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const emailContent = emailTemplate(user, 'Welcome@123'); // Use actual temp password if available

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });

        console.log(`✅ Sent to: ${user.name} (${user.email})`);
        sent++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to send to ${user.email}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✨ Email sending completed!');
    console.log(`   Sent: ${sent}`);
    console.log(`   Failed: ${failed}`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
sendWelcomeEmails();
