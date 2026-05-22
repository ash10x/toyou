import nodemailer from "nodemailer";

const SMTP_HOST = process.env.EMAIL_SMTP_HOST;
const SMTP_PORT = Number(process.env.EMAIL_SMTP_PORT ?? 587);
const SMTP_USER = process.env.EMAIL_SMTP_USER;
const SMTP_PASS = process.env.EMAIL_SMTP_PASS;
const USE_SECURE = process.env.EMAIL_SMTP_SECURE === "true";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "no-reply@toyocar.com";
const ADMIN_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL ?? "support@toyocar.com";

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  throw new Error(
    "Email SMTP configuration missing. Set EMAIL_SMTP_HOST, EMAIL_SMTP_USER, and EMAIL_SMTP_PASS.",
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: USE_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  return transporter.sendMail({
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

export async function sendContactConfirmationEmail(
  name: string,
  email: string,
) {
  const subject = "We received your message";
  const text = `Hi ${name},\n\nThanks for contacting ToyoCar. We received your message and will reply shortly.\n\nBest regards,\nToyoCar Support`;
  const html = `
    <p>Hi ${name},</p>
    <p>Thanks for contacting <strong>ToyoCar</strong>. We received your message and will reply shortly.</p>
    <p>Best regards,<br/>ToyoCar Support</p>
  `;

  return sendMail({ to: email, subject, text, html });
}

export async function sendAdminNotificationEmail(
  name: string,
  email: string,
  message: string,
  adminEmail?: string,
) {
  const notificationEmail = adminEmail || ADMIN_EMAIL;
  const subject = `New contact form submission from ${name}`;
  const text = `New contact request:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${name}<br/>
    <strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message
      .split("\n")
      .map((line) => line.trim())
      .join("<br/>")}</p>
  `;

  return sendMail({ to: notificationEmail, subject, text, html });
}

export async function sendBookingConfirmationEmail(
  name: string,
  email: string,
  carName: string,
  pickupDate: string,
  dropoffDate: string,
  pickupLocation: string,
  dropoffLocation: string,
  totalPrice: number,
) {
  const subject = "Your Booking Confirmation - ToyoCar";
  const text = `Hi ${name},\n\nYour booking has been confirmed!\n\nVehicle: ${carName}\nPickup: ${pickupDate} at ${pickupLocation}\nDropoff: ${dropoffDate} at ${dropoffLocation}\nTotal: $${totalPrice.toFixed(2)}\n\nThank you for choosing ToyoCar!\n\nBest regards,\nToyoCar Team`;
  const html = `
    <p>Hi ${name},</p>
    <p>Your booking has been confirmed!</p>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Vehicle:</strong> ${carName}</p>
      <p><strong>Pickup:</strong> ${pickupDate} at ${pickupLocation}</p>
      <p><strong>Dropoff:</strong> ${dropoffDate} at ${dropoffLocation}</p>
      <p><strong>Total Amount:</strong> <span style="font-size: 18px; color: #dc2626; font-weight: bold;">$${totalPrice.toFixed(2)}</span></p>
    </div>
    <p>Thank you for choosing <strong>ToyoCar</strong>!</p>
    <p>Best regards,<br/>ToyoCar Team</p>
  `;

  return sendMail({ to: email, subject, text, html });
}

export async function sendAdminBookingNotificationEmail(
  name: string,
  email: string,
  phone: string,
  carName: string,
  pickupDate: string,
  dropoffDate: string,
  pickupLocation: string,
  dropoffLocation: string,
  totalPrice: number,
) {
  const subject = `New Booking Reservation from ${name}`;
  const text = `New booking received:\n\nCustomer: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nVehicle: ${carName}\nPickup: ${pickupDate} at ${pickupLocation}\nDropoff: ${dropoffDate} at ${dropoffLocation}\nTotal: $${totalPrice.toFixed(2)}`;
  const html = `
    <h2>New Booking Reservation</h2>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Customer:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <hr/>
      <p><strong>Vehicle:</strong> ${carName}</p>
      <p><strong>Pickup:</strong> ${pickupDate} at ${pickupLocation}</p>
      <p><strong>Dropoff:</strong> ${dropoffDate} at ${dropoffLocation}</p>
      <p><strong>Total Amount:</strong> <span style="color: #dc2626; font-weight: bold;">$${totalPrice.toFixed(2)}</span></p>
    </div>
  `;

  return sendMail({ to: ADMIN_EMAIL, subject, text, html });
}
