import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email configuration missing. Emails will not be sent.');
    return null;
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  // Skip if email is not configured
  if (!transporter) {
    console.log('Skipping OTP email - email not configured');
    return { success: true, skipped: true };
  }

  const message = {
    from: `Zomato Clone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Zomato Clone',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E23744;">Zomato Clone</h2>
        <p>Your OTP for login/signup is:</p>
        <h1 style="background-color: #f5f5f5; padding: 20px; text-align: center; letter-spacing: 5px; color: #E23744;">
          ${otp}
        </h1>
        <p style="color: #666;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  // Skip if email is not configured
  if (!transporter) {
    console.log('Skipping welcome email - email not configured');
    return { success: true, skipped: true };
  }

  const message = {
    from: `Zomato Clone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Zomato Clone!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E23744;">Welcome to Zomato Clone, ${name}!</h2>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        <p>Start exploring restaurants, order food, and discover amazing dining experiences.</p>
        <p style="margin-top: 30px;">Happy eating!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const transporter = createTransporter();

  const itemsHtml = orderDetails.items.map(item => `
    <tr>
      <td>${item.menuItem.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
    </tr>
  `).join('');

  const message = {
    from: `Zomato Clone <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed - #${orderDetails._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E23744;">Order Confirmed!</h2>
        <p>Your order has been placed successfully.</p>
        <h3>Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5;">
          <p style="margin: 5px 0;"><strong>Total: ₹${orderDetails.total}</strong></p>
          <p style="margin: 5px 0; color: #666;">Estimated delivery: ${new Date(orderDetails.estimatedDeliveryTime).toLocaleString()}</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};
