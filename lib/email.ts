// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, { subject, body }: { subject: string; body: string }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@buildxbid.com',
      to,
      subject,
      html: body
    });
    console.log(`📬 Email sent to ${to}:`, info.messageId);
  } catch (err) {
    console.error('❌ Email send error:', err);
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #facc15;">Verify Your BuildX Account</h2>
      <p>Click below to verify your email and activate your account.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="padding: 12px 24px; background: #facc15; color: black; text-decoration: none; font-weight: bold; border-radius: 6px;">
          Verify My Email
        </a>
      </p>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    </div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify Your BuildX Email',
    html
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #0d0d0d; padding: 60px;">
      <div style="max-width: 620px; background: #ffffff; margin: auto; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <img src="https://buildxbid.com/gold-logo.png" alt="BuildX" style="height: 38px; margin-bottom: 30px;" />
        <h1 style="font-size: 30px; color: #111; margin-bottom: 20px;">Welcome to the Future of Construction ⚡</h1>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">Hey <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Your BuildX account is now active. From here on out, you’re not just building — you’re building smarter.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Use your dashboard to post projects, invite subs, get AI-powered takeoffs, or coordinate bids across your design team.
        </p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://buildxbid.com/login" style="background: #facc15; color: #000; padding: 14px 36px; font-weight: bold; font-size: 16px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Launch Your Dashboard
          </a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 40px;">
          Questions? Reach us anytime at <a href="mailto:support@buildxbid.com" style="color: #facc15;">support@buildxbid.com</a>
        </p>
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 24px;">© 2025 BuildX — All rights reserved</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Welcome to BuildX, ${name}!`,
    html,
  });
}

export async function sendRebidEmail(to: string, projectName: string, bidId: string) {
  const url = `${process.env.FRONTEND_URL}/bids/${bidId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px;">
      <h2 style="color: #facc15;">Rebid Request for ${projectName}</h2>
      <p>You’ve been asked to review and resubmit your bid.</p>
      <p>
        <a href="${url}" style="background-color: #facc15; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          View Rebid Request
        </a>
      </p>
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        If the button doesn't work, paste this into your browser:<br/>
        <a href="${url}">${url}</a>
      </p>
    </div>
  `;

  await sendEmail(to, {
    subject: 'Rebid Request – Please Review & Resubmit',
    body: html,
  });
}

export async function sendInviteEmail(to: string, {
  projectName,
  trade,
  inviteLink,
}: {
  projectName: string;
  trade: string;
  inviteLink: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px;">
      <h2 style="color: #facc15;">You’re Invited to Bid on ${projectName}</h2>
      <p>Trade: <strong>${trade}</strong></p>
      <p>You’ve been invited to submit a bid via BuildXBid™.</p>
      <p>
        <a href="${inviteLink}" style="background-color: #facc15; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          View Project + Accept Invite
        </a>
      </p>
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        If the button doesn't work, paste this into your browser:<br/>
        <a href="${inviteLink}">${inviteLink}</a>
      </p>
    </div>
  `;

  await sendEmail(to, {
    subject: `Invitation to Bid – ${projectName}`,
    body: html,
  });
}
