import { Resend } from "resend";

// -------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "tottilotti <noreply@tottilotti.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.warn("[email] NEXT_PUBLIC_APP_URL is not set — email links will point to localhost:3000");
}

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
    subject: "Bitte bestätige deine E-Mail-Adresse · tottilotti",
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo / Brand -->
        <tr>
          <td style="padding:0 0 24px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;font-weight:normal;color:#2C2420;letter-spacing:0.12em;text-transform:lowercase;">tottilotti</p>
          </td>
        </tr>

        <!-- Main card -->
        <tr>
          <td style="background:#FFFFFF;border:1px solid #E5DDD4;">

            <!-- Accent top bar -->
            <div style="height:3px;background:#D4845C;"></div>

            <!-- DE section -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:40px 40px 32px;">
                  <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9B8E87;">Deutsch</p>
                  <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#2C2420;line-height:1.3;">Hallo ${firstName}.</p>
                  <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#6B5E57;">Schön, dass du bei tottilotti dabei bist.<br>Klick auf den Button um deine E-Mail-Adresse zu bestätigen und loszulegen.</p>

                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#2C2420;">
                        <a href="${verifyLink}" style="display:inline-block;padding:14px 36px;font-family:Georgia,serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#FAF6F1;text-decoration:none;">E-Mail bestätigen</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:24px 0 4px;font-size:11px;color:#B5A9A3;">Link funktioniert nicht? Kopiere ihn in deinen Browser:</p>
                  <p style="margin:0 0 4px;font-size:10px;color:#C9BFB4;word-break:break-all;">${verifyLink}</p>
                  <p style="margin:16px 0 0;font-size:11px;color:#C9BFB4;">Gültig für 24 Stunden · Falls du kein Konto erstellt hast, ignoriere diese Mail.</p>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 40px;">
                  <div style="height:1px;background:#F3EDE6;"></div>
                </td>
              </tr>
            </table>

            <!-- EN section -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:28px 40px 40px;">
                  <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9B8E87;">English</p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#9B8E87;">Hi ${firstName}, glad you're here. Please verify your email to activate your account.</p>

                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border:1px solid #E5DDD4;">
                        <a href="${verifyLink}" style="display:inline-block;padding:11px 28px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6B5E57;text-decoration:none;">Verify email</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:16px 0 0;font-size:11px;color:#C9BFB4;">Valid for 24 hours · If you didn't sign up, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0;">
            <p style="margin:0;font-size:11px;color:#B5A9A3;letter-spacing:0.05em;">tottilotti · Deutschland · <a href="${APP_URL}" style="color:#B5A9A3;text-decoration:none;">tottilotti.com</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
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
  locale?: string,
): Promise<void> {
  const localePath = locale && locale !== "en" ? `/${locale}` : "";
  const resetLink = `${APP_URL}${localePath}/reset-password?token=${token}`;

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
// 7a. Interest / direct contact  (one-click contact button)
// -------------------------------------------------------------------

export async function notifyInterest(
  recipientEmail: string,
  recipientFirstName: string,
  senderName: string,
  messagePreview: string,
  matchId: string,
): Promise<void> {
  const link = `${APP_URL}/messages/${matchId}`;
  return sendEmail({
    to: recipientEmail,
    subject: `${senderName} hat dir geschrieben · tottilotti`,
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding:0 0 24px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#2C2420;letter-spacing:0.12em;text-transform:lowercase;">tottilotti</p>
        </td></tr>
        <tr><td style="background:#FFFFFF;border:1px solid #E5DDD4;">
          <div style="height:3px;background:#D4845C;"></div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:40px 40px 32px;">
              <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9B8E87;">Neue Nachricht</p>
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:22px;color:#2C2420;">Hallo ${recipientFirstName}.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#6B5E57;">
                <strong style="color:#2C2420;">${senderName}</strong> hat dir auf tottilotti geschrieben.
              </p>
              <div style="border-left:3px solid #D4845C;padding:12px 16px;background:#FAF6F1;margin:0 0 28px;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6B5E57;font-style:italic;">&ldquo;${messagePreview}&rdquo;</p>
              </div>
              <table cellpadding="0" cellspacing="0">
                <tr><td style="background:#2C2420;">
                  <a href="${link}" style="display:inline-block;padding:14px 36px;font-family:Georgia,serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#FAF6F1;text-decoration:none;">Nachricht lesen</a>
                </td></tr>
              </table>
              <p style="margin:24px 0 0;font-size:11px;color:#C9BFB4;">Antworte direkt in der App — einfach auf den Button klicken.</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 40px;"><div style="height:1px;background:#F3EDE6;"></div></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:24px 40px 32px;">
              <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9B8E87;">English</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#9B8E87;"><strong style="color:#6B5E57;">${senderName}</strong> sent you a message on tottilotti.</p>
              <table cellpadding="0" cellspacing="0"><tr><td style="border:1px solid #E5DDD4;">
                <a href="${link}" style="display:inline-block;padding:11px 28px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6B5E57;text-decoration:none;">Read message</a>
              </td></tr></table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 0 0;">
          <p style="margin:0;font-size:11px;color:#B5A9A3;letter-spacing:0.05em;">tottilotti · Deutschland · <a href="${APP_URL}" style="color:#B5A9A3;text-decoration:none;">tottilotti.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// 7. New Message  (Sender → Recipient gets email)
// -------------------------------------------------------------------

export async function notifyNewMessage(
  recipientEmail: string,
  senderName: string,
  _messagePreview: string,
  bookingId: string,
): Promise<void> {
  return sendEmail({
    to: recipientEmail,
    subject: `New message from ${senderName}`,
    html: `
      <h2>You have a new message</h2>
      <p><strong>${senderName}</strong> sent you a message.</p>
      <p><a href="${APP_URL}/messages/${bookingId}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">View message</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 8. New Match  (Both users like each other → waiting user gets email)
// -------------------------------------------------------------------

export async function notifyNewMatch(
  recipientEmail: string,
  matchedUserName: string,
  matchId: string,
): Promise<void> {
  return sendEmail({
    to: recipientEmail,
    subject: `It's a match! ${matchedUserName} liked you back`,
    html: `
      <h2>It's a match!</h2>
      <p><strong>${matchedUserName}</strong> liked you back on tottilotti.</p>
      <p>Say hello and start a conversation!</p>
      <p><a href="${APP_URL}/messages/${matchId}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Say hello</a></p>
    `,
  });
}

// -------------------------------------------------------------------
// 9. Review Submitted  (Parent reviews → Sitter gets email)
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
// Profile Completion Reminder  (3h after signup, if not onboarded)
// -------------------------------------------------------------------

export async function notifyProfileReminder(
  recipientEmail: string,
  firstName: string,
  role: string,
): Promise<void> {
  const onboardingLink = `${APP_URL}/onboarding`;
  const isParent = role === "PARENT";

  const subject = `${firstName}, your profile is waiting — it only takes 2 minutes`;

  const bodyText = isParent
    ? `You're one step away from finding a babysitter you'll love. Complete your profile and start browsing sitters in your neighborhood today.`
    : `Berlin families are looking for someone like you. Finish setting up your profile so parents can find and book you.`;

  const ctaText = isParent ? "Find my babysitter" : "Complete my profile";

  return sendEmail({
    to: recipientEmail,
    subject,
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hi ${firstName},</p>

        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          You signed up for tottilotti a little while ago — welcome! We just wanted to give you a gentle nudge.
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          ${bodyText}
        </p>

        <p style="margin: 0 0 32px;">
          <a href="${onboardingLink}" style="display: inline-block; background: #1a1a1a; color: #ffffff; text-decoration: none; padding: 13px 28px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; font-family: Arial, sans-serif;">
            ${ctaText}
          </a>
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 8px;">
          It takes about 2 minutes. We'll see you on the other side.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 32px;">
          — The tottilotti team
        </p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

        <p style="font-size: 12px; color: #999; line-height: 1.5; margin: 0;">
          You're receiving this because you created an account at tottilotti.com.
          If you didn't sign up, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

// -------------------------------------------------------------------
// Admin: New Signup Notification  (Any new user → Admin gets email)
// -------------------------------------------------------------------

export async function notifyAdminNewSignup(
  firstName: string,
  lastName: string,
  email: string,
  role: string,
): Promise<void> {
  const adminEmail = "sisiliu2003@icloud.com";
  const usersLink = `${APP_URL}/admin/users`;

  return sendEmail({
    to: adminEmail,
    subject: `New signup: ${firstName} ${lastName} (${role.toLowerCase()})`,
    html: `
      <h2>New user signed up</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Role:</strong> ${role.charAt(0) + role.slice(1).toLowerCase()}</p>
      <p><a href="${usersLink}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;font-size:14px;letter-spacing:0.05em;">View all users</a></p>
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
      <p>Hi ${firstName}, your tottilotti Premium subscription has been successfully renewed.</p>
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
      <p>Hi ${firstName}, your tottilotti Premium subscription has been cancelled.</p>
      <p>You will retain access to Premium features until <strong>${formatDate(accessUntil)}</strong>.</p>
      <p>After that, your account will revert to the free plan.</p>
      <p><a href="${pricingLink}">Resubscribe anytime</a></p>
    `,
  });
}
