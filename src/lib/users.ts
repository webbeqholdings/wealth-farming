'use server'
import { getPayload } from 'payload'
import config from '@payload-config';

interface RichTextChild {
  text: string;
}
interface RichTextBlock {
  type: string;
  children: RichTextChild[];
}
const convertRichTextToHTML = (richText: RichTextBlock[]): string => {
  if (!Array.isArray(richText)) return '<p>Invalid content</p>';
  return richText.map((block) => {
      const textContent = block.children.map((child) => child.text).join('');
      return `<p>${textContent}</p>`; // Default fallback
    })
    .join('');
};

export const updateUserSubscription: any = async (user_id: number): Promise<any> => {
  const payload = await getPayload({
      config,
    })
  await payload.update({
      collection: 'users',
      id: user_id,
      data: {
          subscription: true,
      }
  })
}

export const sendEventNotification: any = async (title: string, text: RichTextBlock[]): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const res = await payload.find({
    collection: 'users',
    where: {
      subscription: {equals: true}
    }
  })
  try {
    const email = await Promise.all(
      res.docs.map(async (user: any) => {
        return payload.email.sendEmail({ to: user.email, subject: title, html: convertRichTextToHTML(text),
        });
      })
    )
  } catch (error) {
    console.error('Error sending email:', error);
  }
  return
}

export const sendOtherNotification: any = async (to: string, title: string, text: RichTextBlock[]): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const user = await payload.find({
    collection: 'users',
    where: {
      id: {equals: to}
    }
  })
  try {
    const email = await payload.email.sendEmail({
      to: user.docs[0].email, subject: title, html: convertRichTextToHTML(text),
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
  return
}