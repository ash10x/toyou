const EMAIL_FROM = process.env.EMAIL_FROM ?? "contact@toyoucarrentals.com";
const ADMIN_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL ?? "contact@toyoucarrentals.com";

async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const host = process.env.EMAIL_SMTP_HOST;
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Email SMTP configuration missing. Set EMAIL_SMTP_HOST, EMAIL_SMTP_USER, and EMAIL_SMTP_PASS.",
    );
  }

  const { default: nodemailer } = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_SMTP_PORT ?? 587),
    secure: process.env.EMAIL_SMTP_SECURE === "true",
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
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
    <p>Thanks for contacting <strong>ToYou Car Rentals</strong>. We received your message and will reply shortly.</p>
    <p>Best regards,<br/>ToYou Car Rentals Support</p>
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
  const subject = "Your Booking Confirmation - ToYou Car Rentals";
  const text = `Hi ${name},\n\nYour booking has been confirmed!\n\nVehicle: ${carName}\nPickup: ${pickupDate} at ${pickupLocation}\nDropoff: ${dropoffDate} at ${dropoffLocation}\nTotal: $${totalPrice.toFixed(2)}\n\nThank you for choosing ToYou Car Rentals!\n\nBest regards,\nToYou Car Rentals Team`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <body
      style="
        margin:0;
        padding:0;
        background:#f3f4f6;
        font-family:Arial, Helvetica, sans-serif;
      "
    >
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="background:#f3f4f6; padding:40px 16px;"
      >
        <tr>
          <td align="center">
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                max-width:640px;
                background:#ffffff;
                border-radius:20px;
                overflow:hidden;
                box-shadow:0 10px 30px rgba(0,0,0,0.08);
              "
            >
              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="
                    background:#ffffff;
                    padding:36px 24px;
                  "
                >
                  <img
                    src="https://www.toyoucarrentals.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75"
                    alt="ToYou Car Rentals"
                    width="140"
                    style="
                      display:block;
                      border:0;
                      max-width:140px;
                    "
                  />
  
                  <p
                    style="
                      margin:20px 0 0;
                      color:#d1d5db;
                      font-size:14px;
                      letter-spacing:1px;
                      text-transform:uppercase;
                    "
                  >
                    Booking Confirmation
                  </p>
  
                  <h1
                    style="
                      margin:10px 0 0;
                      color:#000000;
                      font-size:32px;
                      line-height:1.2;
                    "
                  >
                    Your Reservation is Confirmed
                  </h1>
                </td>
              </tr>
  
              <!-- Body -->
              <tr>
                <td style="padding:40px 32px;">
                  <p
                    style="
                      margin:0 0 18px;
                      font-size:16px;
                      color:#111827;
                      line-height:1.7;
                    "
                  >
                    Hi <strong>${name}</strong>,
                  </p>
  
                  <p
                    style="
                      margin:0 0 28px;
                      font-size:16px;
                      color:#4b5563;
                      line-height:1.7;
                    "
                  >
                    Thank you for choosing
                    <strong>ToYou Car Rentals</strong>. Your booking has been
                    successfully confirmed. Please review your reservation details
                    below.
                  </p>
  
                  <!-- Booking Card -->
                  <div
                    style="
                      background:#f9fafb;
                      border:1px solid #e5e7eb;
                      border-radius:18px;
                      padding:28px;
                    "
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tr>
                        <td
                          style="
                            padding:12px 0;
                            color:#6b7280;
                            font-size:14px;
                          "
                        >
                          Vehicle
                        </td>
  
                        <td
                          align="right"
                          style="
                            padding:12px 0;
                            color:#111827;
                            font-size:15px;
                            font-weight:700;
                          "
                        >
                          ${carName}
                        </td>
                      </tr>
  
                      <tr>
                        <td
                          style="
                            padding:12px 0;
                            color:#6b7280;
                            font-size:14px;
                          "
                        >
                          Pickup
                        </td>
  
                        <td
                          align="right"
                          style="
                            padding:12px 0;
                            color:#111827;
                            font-size:15px;
                            font-weight:700;
                            line-height:1.5;
                          "
                        >
                          ${pickupDate}<br />
                          <span
                            style="
                              font-weight:400;
                              color:#4b5563;
                            "
                          >
                            ${pickupLocation}
                          </span>
                        </td>
                      </tr>
  
                      <tr>
                        <td
                          style="
                            padding:12px 0;
                            color:#6b7280;
                            font-size:14px;
                          "
                        >
                          Dropoff
                        </td>
  
                        <td
                          align="right"
                          style="
                            padding:12px 0;
                            color:#111827;
                            font-size:15px;
                            font-weight:700;
                            line-height:1.5;
                          "
                        >
                          ${dropoffDate}<br />
                          <span
                            style="
                              font-weight:400;
                              color:#4b5563;
                            "
                          >
                            ${dropoffLocation}
                          </span>
                        </td>
                      </tr>
  
                      <tr>
                        <td colspan="2" style="padding-top:16px;">
                          <div
                            style="
                              height:1px;
                              background:#e5e7eb;
                            "
                          ></div>
                        </td>
                      </tr>
  
                      <tr>
                        <td
                          style="
                            padding-top:22px;
                            font-size:16px;
                            font-weight:700;
                            color:#111827;
                          "
                        >
                          Total Amount
                        </td>
  
                        <td
                          align="right"
                          style="
                            padding-top:22px;
                            font-size:28px;
                            font-weight:800;
                            color:#dc2626;
                          "
                        >
                          $${totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </div>
  
                  <!-- Important Notice -->
                  <div
                    style="
                      margin-top:28px;
                      background:#fff7ed;
                      border:1px solid #fdba74;
                      border-radius:16px;
                      padding:20px;
                    "
                  >
                    <p
                      style="
                        margin:0 0 10px;
                        font-size:15px;
                        font-weight:700;
                        color:#9a3412;
                      "
                    >
                      Important Notice
                    </p>
  
                    <p
                      style="
                        margin:0;
                        font-size:14px;
                        line-height:1.7;
                        color:#7c2d12;
                      "
                    >
                      Please note that your reservation is subject to a
                      <strong>48-hour confirmation and preparation window</strong>.
                      A member of our team may contact you if additional details
                      are required before vehicle pickup.
                    </p>
                  </div>
  
                  <!-- Footer Text -->
                  <p
                    style="
                      margin:32px 0 0;
                      font-size:15px;
                      line-height:1.7;
                      color:#4b5563;
                    "
                  >
                    We appreciate your business and look forward to providing you
                    with a smooth rental experience.
                  </p>
  
                  <p
                    style="
                      margin:24px 0 0;
                      font-size:15px;
                      line-height:1.7;
                      color:#111827;
                    "
                  >
                    Best regards,<br />
                    <strong>ToYou Car Rentals Team</strong>
                  </p>
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    background:#f9fafb;
                    padding:24px;
                    border-top:1px solid #e5e7eb;
                  "
                >
                  <p
                    style="
                      margin:0;
                      font-size:13px;
                      color:#6b7280;
                      line-height:1.6;
                    "
                  >
                    © ${new Date().getFullYear()} ToYou Car Rentals. All rights
                    reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return sendMail({ to: email, subject, text, html });
}

export async function sendListingConfirmationEmail(
  firstName: string,
  email: string,
  referenceNumber: string,
  year: string,
  make: string,
  model: string,
  reviewExpiresAt: Date,
) {
  const subject = `Your Vehicle Listing Submission — Ref: ${referenceNumber}`;
  const reviewDate = reviewExpiresAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const text = `Hi ${firstName},\n\nThank you for submitting your ${year} ${make} ${model} for listing with ToYou Car Rentals!\n\nYour reference number is: ${referenceNumber}\n\nOur team will review your submission within 72 hours (by ${reviewDate}). We may reach out if additional information is needed.\n\nBest regards,\nToYou Car Rentals Team`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td align="center" style="background:#ffffff;padding:36px 24px;">
                  <img src="https://www.toyoucarrentals.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75" alt="ToYou Car Rentals" width="140" style="display:block;border:0;max-width:140px;" />
                  <p style="margin:20px 0 0;color:#d1d5db;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Vehicle Listing Submission</p>
                  <h1 style="margin:10px 0 0;color:#000000;font-size:30px;line-height:1.2;">We've Received Your Application</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 32px;">
                  <p style="margin:0 0 18px;font-size:16px;color:#111827;line-height:1.7;">Hi <strong>${firstName}</strong>,</p>
                  <p style="margin:0 0 28px;font-size:16px;color:#4b5563;line-height:1.7;">
                    Thank you for submitting your <strong>${year} ${make} ${model}</strong> for listing with <strong>ToYou Car Rentals</strong>. We've received your application and will begin our review shortly.
                  </p>
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:18px;padding:28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Reference Number</td>
                        <td align="right" style="padding:12px 0;color:#111827;font-size:18px;font-weight:800;letter-spacing:1px;">${referenceNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;color:#6b7280;font-size:14px;">Vehicle</td>
                        <td align="right" style="padding:12px 0;color:#111827;font-size:15px;font-weight:700;">${year} ${make} ${model}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:16px;"><div style="height:1px;background:#e5e7eb;"></div></td>
                      </tr>
                      <tr>
                        <td style="padding-top:20px;color:#6b7280;font-size:14px;">Review Deadline</td>
                        <td align="right" style="padding-top:20px;color:#111827;font-size:15px;font-weight:700;">${reviewDate}</td>
                      </tr>
                    </table>
                  </div>
                  <div style="margin-top:28px;background:#fff7ed;border:1px solid #fdba74;border-radius:16px;padding:20px;">
                    <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#9a3412;">What Happens Next?</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#7c2d12;">
                      Our team will review your submission within <strong>72 hours</strong>. We may contact you via phone or email if additional documentation or photos are required. Please keep an eye on your inbox.
                    </p>
                  </div>
                  <p style="margin:32px 0 0;font-size:15px;line-height:1.7;color:#4b5563;">Please save your reference number for any follow-up inquiries.</p>
                  <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#111827;">Best regards,<br/><strong>ToYou Car Rentals Team</strong></p>
                </td>
              </tr>
              <tr>
                <td align="center" style="background:#f9fafb;padding:24px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">© ${new Date().getFullYear()} ToYou Car Rentals. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
  return sendMail({ to: email, subject, text, html });
}

export async function sendAdminListingNotificationEmail(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  referenceNumber: string,
  year: string,
  make: string,
  model: string,
  vin: string,
  city: string,
  state: string,
  vehicleCondition: string,
) {
  const subject = `New Vehicle Listing Application — ${referenceNumber} — ${year} ${make} ${model}`;
  const text = `New host application received:\n\nRef: ${referenceNumber}\nOwner: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${city}, ${state}\n\nVehicle: ${year} ${make} ${model}\nVIN: ${vin}\nCondition: ${vehicleCondition}`;
  const html = `
    <h2>New Vehicle Listing Application</h2>
    <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <hr/>
      <p><strong>Owner:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${city}, ${state}</p>
      <hr/>
      <p><strong>Vehicle:</strong> ${year} ${make} ${model}</p>
      <p><strong>VIN:</strong> ${vin}</p>
      <p><strong>Condition:</strong> ${vehicleCondition}</p>
    </div>
    <p style="color:#6b7280;font-size:13px;">Review window: 72 hours from submission.</p>
  `;
  return sendMail({ to: ADMIN_EMAIL, subject, text, html });
}

export async function sendListingApprovedEmail(
  firstName: string,
  email: string,
  year: string,
  make: string,
  model: string,
  referenceNumber: string,
  dailyRate: number,
) {
  const subject = `Your Vehicle Has Been Approved — ${year} ${make} ${model}`;
  const text = `Hi ${firstName},\n\nGreat news! Your ${year} ${make} ${model} (Ref: ${referenceNumber}) has been approved and added to the ToYou Car Rentals fleet.\n\nYour vehicle is now live at a rate of $${dailyRate}/day. You will begin earning as soon as your first rental is completed.\n\nRemember: you keep ${80}% of all rental revenue, paid out via direct deposit within a few days of each return.\n\nBest regards,\nToYou Car Rentals Team`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td align="center" style="background:#ffffff;padding:36px 24px;">
                  <img src="https://www.toyoucarrentals.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75" alt="ToYou Car Rentals" width="140" style="display:block;border:0;max-width:140px;" />
                  <p style="margin:20px 0 0;color:#059669;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Vehicle Approved ✓</p>
                  <h1 style="margin:10px 0 0;color:#000000;font-size:30px;line-height:1.2;">You're Live on the Fleet!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 32px;">
                  <p style="margin:0 0 18px;font-size:16px;color:#111827;line-height:1.7;">Hi <strong>${firstName}</strong>,</p>
                  <p style="margin:0 0 28px;font-size:16px;color:#4b5563;line-height:1.7;">
                    Great news! Your <strong>${year} ${make} ${model}</strong> has been reviewed and <strong style="color:#059669;">approved</strong>. It's now part of the ToYou Car Rentals fleet and available for bookings.
                  </p>
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:18px;padding:28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Reference Number</td>
                        <td align="right" style="padding:10px 0;color:#111827;font-size:16px;font-weight:800;">${referenceNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Vehicle</td>
                        <td align="right" style="padding:10px 0;color:#111827;font-size:15px;font-weight:700;">${year} ${make} ${model}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Daily Rate</td>
                        <td align="right" style="padding:10px 0;color:#dc2626;font-size:22px;font-weight:800;">$${dailyRate}/day</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:14px;"><div style="height:1px;background:#d1fae5;"></div></td>
                      </tr>
                      <tr>
                        <td style="padding-top:18px;color:#6b7280;font-size:14px;">Your Share</td>
                        <td align="right" style="padding-top:18px;color:#059669;font-size:20px;font-weight:800;">80% of Revenue</td>
                      </tr>
                    </table>
                  </div>
                  <div style="margin-top:24px;background:#fff7ed;border:1px solid #fdba74;border-radius:16px;padding:20px;">
                    <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#9a3412;">How Payouts Work</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#7c2d12;">
                      You earn <strong>80%</strong> of every rental. Payments are issued via direct deposit within a few days of each vehicle return. Make sure your banking details are up to date.
                    </p>
                  </div>
                  <p style="margin:32px 0 0;font-size:15px;line-height:1.7;color:#4b5563;">Thank you for partnering with us. We look forward to helping your vehicle earn!</p>
                  <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#111827;">Best regards,<br/><strong>ToYou Car Rentals Team</strong></p>
                </td>
              </tr>
              <tr>
                <td align="center" style="background:#f9fafb;padding:24px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">© ${new Date().getFullYear()} ToYou Car Rentals. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
  return sendMail({ to: email, subject, text, html });
}

export async function sendListingRejectedEmail(
  firstName: string,
  email: string,
  year: string,
  make: string,
  model: string,
  referenceNumber: string,
  reason?: string,
) {
  const subject = `Update on Your Vehicle Application — ${referenceNumber}`;
  const reasonText = reason
    ? `\n\nReason provided:\n${reason}`
    : "";
  const text = `Hi ${firstName},\n\nThank you for your interest in listing your ${year} ${make} ${model} with ToYou Car Rentals.\n\nAfter reviewing your application (Ref: ${referenceNumber}), we are unable to approve your vehicle at this time.${reasonText}\n\nIf you believe this was an error or would like to re-apply, please contact our team and we'll be happy to assist.\n\nBest regards,\nToYou Car Rentals Team`;
  const reasonBlock = reason
    ? `<div style="margin-top:24px;background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:20px;">
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#991b1b;">Reason</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#7f1d1d;">${reason}</p>
      </div>`
    : "";
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              <tr>
                <td align="center" style="background:#ffffff;padding:36px 24px;">
                  <img src="https://www.toyoucarrentals.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75" alt="ToYou Car Rentals" width="140" style="display:block;border:0;max-width:140px;" />
                  <p style="margin:20px 0 0;color:#dc2626;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Application Update</p>
                  <h1 style="margin:10px 0 0;color:#000000;font-size:30px;line-height:1.2;">We Could Not Approve Your Vehicle</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 32px;">
                  <p style="margin:0 0 18px;font-size:16px;color:#111827;line-height:1.7;">Hi <strong>${firstName}</strong>,</p>
                  <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.7;">
                    Thank you for taking the time to submit your <strong>${year} ${make} ${model}</strong> for listing. After a careful review of your application, we are unable to approve it at this time.
                  </p>
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:18px;padding:24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Reference Number</td>
                        <td align="right" style="padding:10px 0;color:#111827;font-size:16px;font-weight:800;">${referenceNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Vehicle</td>
                        <td align="right" style="padding:10px 0;color:#111827;font-size:15px;font-weight:700;">${year} ${make} ${model}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;">Status</td>
                        <td align="right" style="padding:10px 0;color:#dc2626;font-size:15px;font-weight:700;">Not Approved</td>
                      </tr>
                    </table>
                  </div>
                  ${reasonBlock}
                  <div style="margin-top:24px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:20px;">
                    <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1e40af;">Have Questions?</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#1e3a8a;">
                      If you believe this decision was made in error, or you'd like to address any concerns and re-apply, please don't hesitate to reach out to our team. We're happy to assist.
                    </p>
                  </div>
                  <p style="margin:32px 0 0;font-size:15px;line-height:1.7;color:#4b5563;">We appreciate your interest in partnering with ToYou Car Rentals.</p>
                  <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#111827;">Best regards,<br/><strong>ToYou Car Rentals Team</strong></p>
                </td>
              </tr>
              <tr>
                <td align="center" style="background:#f9fafb;padding:24px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">© ${new Date().getFullYear()} ToYou Car Rentals. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
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
