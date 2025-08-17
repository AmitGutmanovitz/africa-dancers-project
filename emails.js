const SibApiV3Sdk = require('sib-api-v3-sdk');

const fs = require('fs');
require('dotenv').config();

// Brevo API setup
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();



function createTemplate(type) {
  switch (type) {
case "register":
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Welcome to {{appName}}!</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(135deg, #ffb347, #ffcc33); font-family: 'Arial', sans-serif; color: #333;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(90deg, #ff7eb3, #ff758c); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Welcome, {{username}}! 🎉</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">We’re so excited to have you join our dance party! 💃🕺</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for signing up to <strong>{{appName}}</strong>!  
          Your journey into the world of joyful African greeting dancers starts now.  
          Create, customize, and share videos that make people smile.
        </p>

        <!-- Fun Image -->
        <div style="text-align: center; margin: 25px 0;">
          <img src="https://i.ibb.co/fQwXbGn/african-dancers.png" alt="African Dancers" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>

        <!-- Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{loginLink}}" style="display:inline-block; padding: 14px 28px; background: linear-gradient(90deg, #ff7eb3, #ff758c); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            🚀 Login to Get Started
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          Need help? <a href="{{supportLink}}" style="color: #ff758c; text-decoration: none;">Contact our support team</a>.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; 2025 {{appName}} — Spreading joy one dance at a time 💃🕺
      </td>
    </tr>

  </table>
</body>
</html>
  `;

case "order_paid_confirmed":
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Confirmed!</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(135deg, #d4fc79, #96e6a1); font-family: 'Arial', sans-serif; color: #333;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(90deg, #00b09b, #96c93d); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px;">✅ Order Confirmed, {{username}}!</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">Your payment was successful and your order is ready to be processed.</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6;">
          We’re happy to let you know that we have received payment for your order <strong>#{{orderId}}</strong>.  
          Our team is now preparing everything for you.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          You’ll get another update when your African greeting dance video is ready! 🎉
        </p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="{{orderLink}}" target="_blank" style="display:inline-block; padding: 14px 28px; background: linear-gradient(90deg, #00b09b, #96c93d); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            View My Order
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          Thank you for trusting {{appName}} — We can’t wait for you to see the performance! 💃🌍
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; 2025 {{appName}} — Celebrating life through dance 💃🕺
      </td>
    </tr>

  </table>
</body>
</html>
  `;


case "login":
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Welcome Back!</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(135deg, #ffb347, #ffcc33); font-family: 'Arial', sans-serif; color: #333;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(90deg, #ff7eb3, #ff758c); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Welcome Back, {{username}}! 🎉</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">We’ve missed you! Let’s create something amazing today. 🌟</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6;">
          Your African greeting dancers are ready to party!  
          You’ve successfully logged in and can now manage your orders, edit your profile, and explore our latest joyful creations.
        </p>

        <!-- Fun Image -->

  

        <p style="font-size: 14px; color: #888; text-align: center;">
          Didn’t log in just now? <a href="{{resetPasswordLink}}" style="color: #ff758c; text-decoration: none;">Reset your password</a> immediately.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; 2025 {{appName}} — Spreading joy one dance at a time 💃🕺
      </td>
    </tr>

  </table>
</body>
</html>
  `;

    case "order_unpaid":
       return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Placed - Awaiting Payment</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(135deg, #fff3b0, #ffb347); font-family: 'Arial', sans-serif; color: #333;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(90deg, #f9d423, #ff4e50); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px;">🛒 Order Received, {{username}}!</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">We’re holding your spot — let’s finish the payment so we can start dancing!</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6;">
          Your order <strong>#{{orderId}}</strong> has been placed successfully,  
          but we haven’t received your payment yet.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Once the payment is confirmed, we’ll start preparing your amazing African greeting dance video 🎥💃.
        </p>

        <!-- Order Summary -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; background: #fafafa;"><strong>Order ID:</strong></td>
            <td style="padding: 10px; border: 1px solid #eee;">{{orderId}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; background: #fafafa;"><strong>Total:</strong></td>
            <td style="padding: 10px; border: 1px solid #eee;">{{orderTotal}}</td>
          </tr>
        </table>

        <!-- Payment Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="{{paymentLink}}" style="display:inline-block; padding: 14px 28px; background: linear-gradient(90deg, #f9d423, #ff4e50); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            💳 Complete Payment Now
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          If you’ve already paid, please ignore this message.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; 2025 {{appName}} — Bringing joy through dance 💃🕺
      </td>
    </tr>

  </table>
</body>
</html>
  `;

    case "updated":
      return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Updated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
<table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; margin: 30px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
<tr>
<td style="background-color: #FFA500; padding: 20px; text-align: center; color: white;">
<h1>Your Order is in Progress</h1>
</td>
</tr>
<tr>
<td style="padding: 20px; color: #333;">
<p>Hi {{username}},</p>
<p>Your order <strong>#{{orderId}}</strong> is now in progress! Our African dancers are getting ready.</p>
<a href="{{orderLink}}" style="display:inline-block; padding: 12px 24px; background-color: #FFA500; color: white; text-decoration: none; border-radius: 6px;">View Order Status</a>
</td>
</tr>
</table>
</body>
</html>
`;
    case "video_ready":
      return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Your Video is Ready!</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(135deg, #c2ffd8, #465efb); font-family: 'Arial', sans-serif; color: #333;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.15);">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(90deg, #56ccf2, #2f80ed); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px;">🎉 Your Video is Ready, {{username}}!</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">Time to enjoy your African greeting dance performance!</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 25px;">
        <p style="font-size: 16px; line-height: 1.6;">
          Your order <strong>#{{orderId}}</strong> is complete and your video is ready to watch.  
          Click below to see your special greeting dance! 💃🕺
        </p>

        <!-- Thumbnail Link to YouTube -->
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://www.youtube.com/watch?v=kmJeJyMvmjk" target="_blank" style="text-decoration: none;">
            <img src="https://img.youtube.com/vi/kmJeJyMvmjk/0.jpg" alt="Your Greeting Dance Video" style="width: 100%; max-width: 500px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
          </a>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="https://www.youtube.com/watch?v=kmJeJyMvmjk" target="_blank" style="display:inline-block; padding: 14px 28px; background: linear-gradient(90deg, #56ccf2, #2f80ed); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            ▶ Watch My Video
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          We hope this performance brings you joy! ❤️
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; 2025 {{appName}} — Celebrating life through dance 🌍💃
      </td>
    </tr>

  </table>
</body>
</html>
  `;
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

/**
 * שליחת מייל כללי
 * @param {string} clientEmail - מייל הלקוח
 * @param {string} clientName - שם הלקוח
 * @param {string} type - סוג המייל ("welcome" / "video_ready")
 * @param {object} extraData - מידע נוסף לפי הצורך (למשל { videoPath: "/path/video.mp4" })
 */

async function sendEmail(clientEmail, clientName, type, extraData = {}) {
  let subject = type
  let htmlContent = "";
  let attachments = [];
  
  // בוחר את סוג המייל לפי type
  htmlContent = createTemplate(type)

  // הכנת המייל לשליחה
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { email: "amitgut3210@gmail.com", name: "Africa Videos" };
  sendSmtpEmail.to = [{ email: clientEmail, name: clientName }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  if (attachments.length > 0) {
    sendSmtpEmail.attachment = attachments;
  }

  // שליחה
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ ${type} email sent to ${clientEmail}`, data);
  } catch (error) {
    console.error(`❌ Error sending ${type} email to ${clientEmail}:`, error.response?.text || error.message);
  }
}



module.exports = sendEmail;
