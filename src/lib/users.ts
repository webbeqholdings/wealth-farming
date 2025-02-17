'use server'
import { getPayload } from 'payload'
import config from '@payload-config';
import { format } from 'date-fns';

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
      return `<p style="font-size: 16px">${textContent}</p>`; // Default fallback
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

export const sendEventNotification: any = async (title: string, text: RichTextBlock[], description: string, date: Date): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const res = await payload.find({
    collection: 'users',
    where: {
      subscription: {equals: true}
    }
  })
  console.log('date', date)
  const formatDate = format(date, 'dd/MM/yyyy')
  console.log('formatdate', formatDate)
  try {
    const email = await Promise.all(
      res.docs.map(async (user: any) => {
        const htmlContent = `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Event: ${title}</title>
            </head>
            <body
              style="
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #000000;
              "
            >
              <table role="presentation" style="width: 100%; border-collapse: collapse">
                <tr>
                  <td align="center" style="padding: 40px 0">
                    <table
                      role="presentation"
                      style="
                        width: 600px;
                        border-collapse: collapse;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      "
                    >
                      <!-- Header -->
                      <tr>
                        <td
                          style="
                            padding: 40px 30px;
                            text-align: center;
                            background-color: #007bff;
                            color: #000000;
                            border-radius: 8px 8px 0 0;
                          "
                        >
                          <h1 style="color: #ffffff; font-size: 28px; margin: 0">
                            ${title}
                          </h1>
                        </td>
                      </tr>
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px">
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            Hello ${user.first_name} ${user.last_name},
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            We would like to invite you to our upcoming event:
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Event:</strong> ${title}
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Date:</strong> ${formatDate}
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Description:</strong> ${description}
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Details:</strong> <div style="margin-left: 10px;"> 
                            <p style="margin-left: 10px;">${convertRichTextToHTML(text)}</p></div>
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            We hope to see you there! If you have any questions or need further information, please don’t hesitate to reach out.
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td
                          style="
                            padding: 30px;
                            text-align: center;
                            font-size: 14px;
                            background-color: #f8f8f8;
                            border-radius: 0 0 8px 8px;
                          "
                        >
                          <p style="margin: 0; color: #666666">© 2025 BEQ Holdings. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `;
        return payload.email.sendEmail({ to: user.email, subject: title, html: htmlContent,
        });
      })
    )
  } catch (error) {
    console.error('Error sending email:', error);
  }
  return
}

export const sendOtherNotification: any = async (to: string, title: string, text: RichTextBlock[], description: string, type: string): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const user = await payload.find({
    collection: 'users',
    where: {
      id: {equals: to}
    }
  })
  const htmlContent = `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Event: ${title}</title>
            </head>
            <body
              style="
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #000000;
              "
            >
              <table role="presentation" style="width: 100%; border-collapse: collapse">
                <tr>
                  <td align="center" style="padding: 40px 0">
                    <table
                      role="presentation"
                      style="
                        width: 600px;
                        border-collapse: collapse;
                        background-color: #ffffff;
                        color: #000000;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      "
                    >
                      <!-- Header -->
                      <tr>
                        <td
                          style="
                            padding: 40px 30px;
                            text-align: center;
                            background-color: #007bff;
                            border-radius: 8px 8px 0 0;
                          "
                        >
                          <h1 style="color: #ffffff; font-size: 28px; margin: 0">
                            ${type.toUpperCase()} : ${title}
                          </h1>
                        </td>
                      </tr>
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px">
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            Hello ${user.docs[0].first_name} ${user.docs[0].last_name},
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            We would like to notify you:
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Title:</strong> ${title}
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Description:</strong> ${description}
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            <strong>Details:</strong> <div style="margin-left: 10px;"> 
                            <p style="margin-left: 10px;">${convertRichTextToHTML(text)}</p></div>
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
                            If you have any questions or need further information, please don’t hesitate to reach out.
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td
                          style="
                            padding: 30px;
                            text-align: center;
                            font-size: 14px;
                            background-color: #f8f8f8;
                            border-radius: 0 0 8px 8px;
                          "
                        >
                          <p style="margin: 0; color: #666666">© 2025 BEQ Holdings. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `;
  try {
    const email = await payload.email.sendEmail({
      to: user.docs[0].email, subject: title, html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
  return
}