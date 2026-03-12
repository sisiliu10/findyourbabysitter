import { Resend } from "resend";

// -------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "FindYourBabysitter <noreply@berlinbabysitter.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// -------------------------------------------------------------------
// Generic send
// -------------------------------------------------------------------

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping:", subject);
    return;
  }

  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (error) {
    console.error("[email] Failed to send:", subject, error);
  }
}

// -------------------------------------------------------------------
// Shared types
// -------------------------------------------------------------------

export interface BookingEmailData {
  bookingId: string;
  dateBooked: Date;
  startTime: string;
  endTime: string;
  agreedRate: number;
  parentName: string;
  parentEmail: string;
  sitterName: string;
  sitterEmail: string;
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function bookingLink(bookingId: string): string {
  return `${APP_URL}/bookings/${bookingId}`;
}

// -------------------------------------------------------------------
// 0. Email Verification  (User registers → gets verification link)
// -------------------------------------------------------------------

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  token: string,
): Promise<void> {
  const verifyLink = `${APP_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome to FindYourBabysitter!</h2>
      <p>Hi ${firstName}, thanks for signing up. Please verify your email address to get started.</p>
      <p><a href="${verifyLink}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Verify my email</a></p>
      <p style="margin-top:24px;font-size:13px;color:#666;">Or copy and paste this link into your browser:</p>
      <p style="font-size:13px;color:#666;word-break:break-all;">${verifyLink}</p>
      <p style="margin-top:24px;font-size:12px;color:#999;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    `,
  });
}

// -------------------------------------------------------------------
// 0b. Password Reset  (User requests reset → gets reset link)
// -------------------------------------------------------------------

export async function sendPasswordResetEmail(
  email: string,
  firstName: string,
  token: string,
): Promise<void> {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password reset request</h2>
      <p>Hi ${firstName}, we received a request to reset your password.</p>
      <p><a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Reset my password</a></p>
      <p style="margin-top:24px;font-size:13px;color:#666;">Or copy and paste this link into your browser:</p>
      <p style="font-size:13px;color:#666;word-break:break-all;">${resetLink}</p>
      <p style="margin-top:24px;font-size:12px;color:#999;">This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.</p>
    `,
  });
}

// -------------------------------------------------------------------
// 1. Booking Created  (Parent books → Sitter gets email)
// -------------------------------------------------------------------

export async function notifyBookingCreated(data: BookingEmailData): Promise<void> {
  return sendEmail({
    to: data.sitterEmail,
    subject: `New booking request from ${data.parentName}`,
    html: `
      <h2>You have a new booking request!</h2>
      <p><strong>${data.parentName}</strong> would like to book you for babysitting.</p>
      <p><strong>Date:</strong> ${formatDate(data.dateBooked)}</p>
      <p><strong>Time:</strong> ${formatTime(data.startTime)} – ${formatTime(data.endTime)}</p>
      <p><strong>Rate:</strong> €${data.agreedRate}/hr</p>
      <p><a href="${bookingLink(data.bookingId)}">View and respond to this booking</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 2. Booking Accepted  (Sitter accepts → Parent gets email)
// -------------------------------------------------------------------

export async function notifyBookingAccepted(data: BookingEmailData): Promise<void> {
  return sendEmail({
    to: data.parentEmail,
    subject: `${data.sitterName} accepted your booking!`,
    html: `
      <h2>Great news!</h2>
      <p><strong>${data.sitterName}</strong> has accepted your booking request.</p>
      <p><strong>Date:</strong> ${formatDate(data.dateBooked)}</p>
      <p><strong>Time:</strong> ${formatTime(data.startTime)} – ${formatTime(data.endTime)}</p>
      <p>Please confirm the booking to finalize.</p>
      <p><a href="${bookingLink(data.bookingId)}">Confirm your booking</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 3. Booking Declined  (Sitter declines → Parent gets email)
// -------------------------------------------------------------------

export async function notifyBookingDeclined(
  data: BookingEmailData,
  reason?: string,
): Promise<void> {
  return sendEmail({
    to: data.parentEmail,
    subject: `${data.sitterName} declined your booking request`,
    html: `
      <h2>Booking update</h2>
      <p><strong>${data.sitterName}</strong> is unable to accept your booking for ${formatDate(data.dateBooked)}.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>You can browse other available sitters and create a new booking.</p>
      <p><a href="${APP_URL}/dashboard">Go to your dashboard</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 4. Booking Confirmed  (Parent confirms → Sitter gets email)
// -------------------------------------------------------------------

export async function notifyBookingConfirmed(data: BookingEmailData): Promise<void> {
  return sendEmail({
    to: data.sitterEmail,
    subject: `Booking confirmed with ${data.parentName}`,
    html: `
      <h2>Your booking is confirmed!</h2>
      <p><strong>${data.parentName}</strong> has confirmed the booking.</p>
      <p><strong>Date:</strong> ${formatDate(data.dateBooked)}</p>
      <p><strong>Time:</strong> ${formatTime(data.startTime)} – ${formatTime(data.endTime)}</p>
      <p><strong>Rate:</strong> €${data.agreedRate}/hr</p>
      <p><a href="${bookingLink(data.bookingId)}">View booking details</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 5. Booking Completed  (Parent marks done → Sitter gets email)
// -------------------------------------------------------------------

export async function notifyBookingCompleted(data: BookingEmailData): Promise<void> {
  return sendEmail({
    to: data.sitterEmail,
    subject: `Booking with ${data.parentName} marked as completed`,
    html: `
      <h2>Booking completed!</h2>
      <p><strong>${data.parentName}</strong> has marked your booking on ${formatDate(data.dateBooked)} as completed.</p>
      <p>Thank you for your great work!</p>
      <p><a href="${bookingLink(data.bookingId)}">View booking details</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 6. Booking Cancelled  (Either party → Other party gets email)
// -------------------------------------------------------------------

export async function notifyBookingCancelled(
  data: BookingEmailData,
  cancelledByName: string,
  recipientEmail: string,
  reason?: string,
): Promise<void> {
  return sendEmail({
    to: recipientEmail,
    subject: `Booking on ${formatDate(data.dateBooked)} has been cancelled`,
    html: `
      <h2>Booking cancelled</h2>
      <p><strong>${cancelledByName}</strong> has cancelled the booking for ${formatDate(data.dateBooked)}.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p><a href="${APP_URL}/dashboard">Go to your dashboard</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 7. New Message  (Sender → Recipient gets email)
// -------------------------------------------------------------------

export async function notifyNewMessage(
  recipientEmail: string,
  senderName: string,
  messagePreview: string,
  bookingId: string,
): Promise<void> {
  const preview =
    messagePreview.length > 150
      ? messagePreview.slice(0, 150) + "..."
      : messagePreview;

  return sendEmail({
    to: recipientEmail,
    subject: `New message from ${senderName}`,
    html: `
      <h2>You have a new message</h2>
      <p><strong>${senderName}</strong> sent you a message:</p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">
        ${preview}
      </blockquote>
      <p><a href="${APP_URL}/messages/${bookingId}">Reply to this message</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 8. Review Submitted  (Parent reviews → Sitter gets email)
// -------------------------------------------------------------------


export async function notifyReviewSubmitted(
  sitterEmail: string,
  parentName: string,
  rating: number,
  bookingId: string,
): Promise<void> {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return sendEmail({
    to: sitterEmail,
    subject: `${parentName} left you a review`,
    html: `
      <h2>You received a new review!</h2>
      <p><strong>${parentName}</strong> left you a ${rating}-star review.</p>
      <p style="font-size: 24px;">${stars}</p>
      <p><a href="${bookingLink(bookingId)}">View the full review</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 9. Payment Failed  (Stripe webhook → User gets email)
// -------------------------------------------------------------------

export async function notifyPaymentFailed(
  email: string,
  firstName: string,
): Promise<void> {
  const subscriptionLink = `${APP_URL}/subscription`;

  return sendEmail({
    to: email,
    subject: "Your payment failed — action required",
    html: `
      <h2>Payment failed</h2>
      <p>Hi ${firstName}, we were unable to process your subscription payment.</p>
      <p>Your Premium access has been paused. To restore it, please update your payment method.</p>
      <p><a href="${subscriptionLink}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Fix my payment</a></p>
      <p style="margin-top:24px;font-size:12px;color:#999;">Stripe will automatically retry your payment. If it fails again, your subscription will be cancelled.</p>
    `,
  });
}

// -------------------------------------------------------------------
// 10. Payment Action Required  (SCA/3DS needed → User gets email)
// -------------------------------------------------------------------

export async function notifyPaymentActionRequired(
  email: string,
  firstName: string,
): Promise<void> {
  const subscriptionLink = `${APP_URL}/subscription`;

  return sendEmail({
    to: email,
    subject: "Action required: authenticate your payment",
    html: `
      <h2>Your payment needs authentication</h2>
      <p>Hi ${firstName}, your bank requires you to verify this payment (3D Secure / SCA).</p>
      <p>Your Premium access has been paused until you complete the authentication.</p>
      <p><a href="${subscriptionLink}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Authenticate now</a></p>
      <p style="margin-top:24px;font-size:12px;color:#999;">This is required by EU payment regulations (PSD2). It only takes a moment.</p>
    `,
  });
}

// -------------------------------------------------------------------
// 11. Subscription Renewed  (Stripe webhook → User gets email)
// -------------------------------------------------------------------

export async function notifySubscriptionRenewed(
  email: string,
  firstName: string,
  nextBillingDate?: Date,
): Promise<void> {
  const subscriptionLink = `${APP_URL}/subscription`;

  return sendEmail({
    to: email,
    subject: "Your Premium subscription has been renewed",
    html: `
      <h2>Subscription renewed</h2>
      <p>Hi ${firstName}, your FindYourBabysitter Premium subscription has been successfully renewed.</p>
      ${nextBillingDate ? `<p><strong>Next billing date:</strong> ${formatDate(nextBillingDate)}</p>` : ""}
      <p><a href="${subscriptionLink}">View your subscription</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 12. Subscription Canceled  (Stripe webhook → User gets email)
// -------------------------------------------------------------------

export async function notifySubscriptionCanceled(
  email: string,
  firstName: string,
  accessUntil: Date,
): Promise<void> {
  const pricingLink = `${APP_URL}/pricing`;

  return sendEmail({
    to: email,
    subject: "Your Premium subscription has been cancelled",
    html: `
      <h2>Subscription cancelled</h2>
      <p>Hi ${firstName}, your FindYourBabysitter Premium subscription has been cancelled.</p>
      <p>You will retain access to Premium features until <strong>${formatDate(accessUntil)}</strong>.</p>
      <p>After that, your account will revert to the free plan.</p>
      <p><a href="${pricingLink}">Resubscribe anytime</a></p>
    `,
  });
}
