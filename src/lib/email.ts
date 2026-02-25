import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@stroudtechnicalsolutions.com';
const EMAIL_TO = process.env.EMAIL_TO || 'info@stroudtechnicalsolutions.com';

// ─── Contact Form Notification ───────────────────────────────────

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log('Resend not configured — skipping email notification');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0A1628; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>` : ''}
          ${data.company ? `<tr><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">${data.company}</td></tr>` : ''}
        </table>
        <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px;">
          <h3 style="margin: 0 0 8px;">Message:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `New Contact: ${data.name} - Stroud Technical Solutions`,
    html,
  });
}

// ─── Job Application Notification ────────────────────────────────

interface ApplicationEmailData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter?: string;
  resumeUrl: string;
}

export async function sendApplicationNotification(data: ApplicationEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log('Resend not configured — skipping email notification');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0A1628; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Job Application</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Position:</td><td style="padding: 8px;">${data.position}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>` : ''}
        </table>
        ${data.coverLetter ? `
        <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px;">
          <h3 style="margin: 0 0 8px;">Cover Letter:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.coverLetter}</p>
        </div>` : ''}
        <div style="margin-top: 16px; text-align: center;">
          <a href="${data.resumeUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            📄 Download Resume
          </a>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `New Application: ${data.position} - ${data.name}`,
    html,
  });
}
