import { getPayload } from 'payload'
import config from '@payload-config';

export async function sendMailText(mail_to: string, subject: string, content: string) {
  const payload = await getPayload({
      config
  });

  try {
    const email = await payload.email.sendEmail({
      to: [mail_to],
      subject: subject,
      text: content,
    })
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
