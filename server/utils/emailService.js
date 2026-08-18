/**
 * Email Notification Service - EM Event Management
 * Features responsive HTML email templates with official EM Logo header
 * for Registration, Booking, Payment, Password Reset, Event Reminders, and Ticket Pass Confirmations.
 */

const generateEMEmailHTML = ({ title, recipientName, bodyText, callToActionText, callToActionURL, detailsGrid }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #121216; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 30px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.3); }
          .logo-img { width: 70px; height: auto; margin-bottom: 10px; }
          .brand-title { font-size: 22px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 1px; }
          .brand-tag { font-size: 11px; color: #fef08a; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
          .content { padding: 30px; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
          .text { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
          .grid { background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.2); margin-bottom: 24px; }
          .grid-item { font-size: 13px; color: #ffffff; margin-bottom: 8px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d4af37); color: #000000; font-weight: 800; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; }
          .footer { background-color: #070a12; padding: 20px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.06); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://em-events.com/em-event-management-logo.png" class="logo-img" alt="EM Logo" />
            <div class="brand-title">EM Event Management</div>
            <div class="brand-tag">Plan • Organize • Execute • Celebrate</div>
          </div>
          <div class="content">
            <div class="title">${title}</div>
            <div class="text">Hello ${recipientName || 'Valued Attendee'},<br/><br/>${bodyText}</div>
            ${detailsGrid ? `<div class="grid">${detailsGrid}</div>` : ''}
            ${callToActionText ? `<div style="text-align:center; margin: 30px 0;"><a href="${callToActionURL || '#'}" class="btn">${callToActionText}</a></div>` : ''}
          </div>
          <div class="footer">
            © 2026 EM Event Management. All Rights Reserved. • 777 Executive Blvd, New York, NY
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  generateEMEmailHTML
};
