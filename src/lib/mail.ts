import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMailText(mail_to: string, subject: string, content: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Wealth Farming <${process.env.MAIL_ADDRESS_NO_REPLY}>`,
      to: [mail_to],
      subject: subject,
      text: content,
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
