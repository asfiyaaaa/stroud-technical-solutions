import { Resend } from 'resend';

// ─── Resend Singleton ──────────────────────────────────────────────
// Lazily instantiated so env vars are definitely available at call-time.
let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not configured — email will be skipped');
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@stroudtechnicalsolutions.com';
const EMAIL_TO = process.env.EMAIL_TO || 'info@stroudtechnicalsolutions.com';

// ─── Contact Form Notification ─────────────────────────────────────

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

/**
 * Sends a contact-form notification email.
 * This function NEVER throws — all errors are caught and logged internally.
 * Returns true if email was sent, false otherwise.
 */
export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.log('[EMAIL] Resend not configured — skipping contact notification');
    return false;
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

  console.log('[EMAIL] Sending contact notification for:', data.name);

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Contact: ${data.name} - Stroud Technical Solutions`,
      html,
    });

    if (error) {
      console.error('EMAIL ERROR', error);
      return false;
    }

    console.log('[EMAIL] Contact notification sent successfully');
    return true;
  } catch (error) {
    console.error('EMAIL ERROR', error);
    return false;
  }
}

// ─── Job Application Notification ──────────────────────────────────

interface ApplicationEmailData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeViewUrl?: string;
}

/**
 * Sends a job-application notification email.
 * This function NEVER throws — all errors are caught and logged internally.
 * Returns true if email was sent, false otherwise.
 *
 * IMPORTANT: Only call this AFTER the resume has been uploaded to Cloudinary
 * AND the application has been saved to the database.
 */
export async function sendApplicationNotification(data: ApplicationEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.log('[EMAIL] Resend not configured — skipping application notification');
    return false;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0A1628; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Job Application</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Position:</td><td style="padding: 8px;">${data.position}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td>    <td style="padding: 8px;">${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td>   <td style="padding: 8px;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>` : ''}
        </table>
        ${data.coverLetter ? `
        <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px;">
          <h3 style="margin: 0 0 8px;">Cover Letter:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.coverLetter}</p>
        </div>` : ''}
        <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px;">
          <p><strong>Resume:</strong></p>
          <p>
            <a href="${data.resumeViewUrl}" target="_blank" style="color: #059669; font-weight: bold;">View Resume</a>
          </p>
          <p>
            <a href="${data.resumeUrl}" style="color: #2563eb; font-weight: bold;">Download Resume</a>
          </p>
        </div>
      </div>
    </div>
  `;

  console.log('[EMAIL] Sending application notification for:', data.name, '-', data.position);

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Application: ${data.position} - ${data.name}`,
      html,
    });

    if (error) {
      console.error('EMAIL ERROR', error);
      return false;
    }

    console.log('[EMAIL] Application notification sent successfully');
    return true;
  } catch (error) {
    console.error('EMAIL ERROR', error);
    return false;
  }
}
