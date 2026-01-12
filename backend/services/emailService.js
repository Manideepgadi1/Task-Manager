const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@taskmanager.com',
  isProduction: process.env.NODE_ENV === 'production',
  // For demo: log to console instead of sending real emails
  useDemoMode: process.env.EMAIL_DEMO_MODE !== 'false'
};

// Create transporter (only if not in demo mode)
let transporter = null;

if (!emailConfig.useDemoMode && process.env.EMAIL_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    // Demo mode: log to console
    if (emailConfig.useDemoMode) {
      console.log('\n📧 ============ EMAIL NOTIFICATION ============');
      console.log(`📬 To: ${to}`);
      console.log(`📝 Subject: ${subject}`);
      console.log(`📄 Content:\n${html}`);
      console.log('📧 ============================================\n');
      return { success: true, mode: 'demo' };
    }

    // Production mode: send real email
    if (!transporter) {
      console.error('❌ Email transporter not configured');
      return { success: false, error: 'Email not configured' };
    }

    const mailOptions = {
      from: emailConfig.from,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  taskAssigned: (employeeName, taskTitle, taskDescription, dueDate, priority, assignedByName) => {
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const priorityColors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      urgent: '#DC2626'
    };
    const priorityColor = priorityColors[priority?.toLowerCase()] || '#6B7280';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1f2937; 
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
          }
          .header { 
            background: #000000;
            color: white; 
            padding: 32px 24px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 32px 24px;
          }
          .greeting {
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 16px;
          }
          .intro {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 24px;
          }
          .task-overview {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .task-overview h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          .task-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .task-row:last-child {
            border-bottom: none;
          }
          .task-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 100px;
            font-size: 14px;
          }
          .task-value {
            color: #1f2937;
            font-size: 14px;
          }
          .priority-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: white;
            background-color: ${priorityColor};
          }
          .task-description {
            background: white;
            border-left: 4px solid #4F46E5;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .task-description h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }
          .task-description p {
            margin: 0;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.6;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .cta-button {
            background-color: #4F46E5;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            font-size: 15px;
            transition: background-color 0.2s;
          }
          .cta-button:hover {
            background-color: #4338CA;
          }
          .footer { 
            text-align: center; 
            color: #6b7280; 
            font-size: 13px; 
            padding: 24px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
          }
          .footer p {
            margin: 4px 0;
          }
          .footer strong {
            color: #1f2937;
            font-weight: 600;
          }
          hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 You've got a new task!</h1>
          </div>
          <div class="content">
            <p class="greeting">Hi <strong>${employeeName}</strong>,</p>
            <p class="intro"><strong>${assignedByName || 'Admin'}</strong> assigned you to <strong>${taskTitle}</strong>. Let's make it happen!</p>
            
            <hr>
            
            <div class="task-overview">
              <h3>📝 Task Overview</h3>
              <div class="task-row">
                <span class="task-label">Project:</span>
                <span class="task-value">Task Management System</span>
              </div>
              <div class="task-row">
                <span class="task-label">Task:</span>
                <span class="task-value">${taskTitle}</span>
              </div>
              <div class="task-row">
                <span class="task-label">Assigned To:</span>
                <span class="task-value">${employeeName}</span>
              </div>
              <div class="task-row">
                <span class="task-label">Priority:</span>
                <span class="task-value"><span class="priority-badge">${priority || 'Medium'}</span></span>
              </div>
              <div class="task-row">
                <span class="task-label">Due Date:</span>
                <span class="task-value">${formattedDate}</span>
              </div>
            </div>
            
            <hr>
            
            <div class="task-description">
              <h4>📄 Task Details</h4>
              <p>${taskDescription}</p>
            </div>
            
            <div class="button-container">
              <a href="http://82.25.105.18/taskmanager/" class="cta-button" style="background-color: #4F46E5; color: #ffffff !important; text-decoration: none;">Click Here to View Task 👉</a>
            </div>
            
            <p style="font-size: 13px; color: #6b7280; margin-top: 32px; font-style: italic;">
              💡 Small steps daily make big wins. You've got this!
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
              You're receiving this email because you're assigned to this task.<br>
              Manage preferences in your account settings.
            </p>
          </div>
          <div class="footer">
            <p><strong>VS Task Manager</strong></p>
            <p>Work Smarter, Play Harder ✨</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  taskCompleted: (adminName, employeeName, taskTitle) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
          .task-details { background: white; padding: 15px; border-left: 4px solid #10B981; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Task Completed</h1>
          </div>
          <div class="content">
            <p>Hello ${adminName},</p>
            <p><strong>${employeeName}</strong> has completed the following task:</p>
            <div class="task-details">
              <h3>${taskTitle}</h3>
            </div>
            <p>Please log in to VS Task Manager to review the completed task.</p>
          </div>
          <div class="footer">
            <p>VS Task Manager | Work Smarter, Play Harder 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  taskUpdated: (employeeName, taskTitle, changes) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
          .task-details { background: white; padding: 15px; border-left: 4px solid #F59E0B; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Task Updated</h1>
          </div>
          <div class="content">
            <p>Hello ${employeeName},</p>
            <p>Your task has been updated:</p>
            <div class="task-details">
              <h3>${taskTitle}</h3>
              <p>${changes}</p>
            </div>
            <p>Please log in to VS Task Manager to view the updated details.</p>
          </div>
          <div class="footer">
            <p>VS Task Manager | Work Smarter, Play Harder 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

// Helper functions to send specific emails
const sendTaskAssignedEmail = async (employeeEmail, employeeName, taskTitle, taskDescription, dueDate, priority = 'medium', assignedByName = 'Admin') => {
  const subject = `${assignedByName} assigned you to ${taskTitle}`;
  const html = emailTemplates.taskAssigned(employeeName, taskTitle, taskDescription, dueDate, priority, assignedByName);
  return await sendEmail(employeeEmail, subject, html);
};

const sendTaskCompletedEmail = async (adminEmail, adminName, employeeName, taskTitle) => {
  const html = emailTemplates.taskCompleted(adminName, employeeName, taskTitle);
  return await sendEmail(adminEmail, `Task Completed: ${taskTitle}`, html);
};

const sendTaskUpdatedEmail = async (employeeEmail, employeeName, taskTitle, changes = 'The task details have been updated.') => {
  const html = emailTemplates.taskUpdated(employeeName, taskTitle, changes);
  return await sendEmail(employeeEmail, `Task Updated: ${taskTitle}`, html);
};

module.exports = {
  sendEmail,
  sendTaskAssignedEmail,
  sendTaskCompletedEmail,
  sendTaskUpdatedEmail
};
