import { getPayload } from 'payload'
import config from '@payload-config';

export const sendEmailDeposit = async (to: string, subject: string, first_name: string, last_name: string, amount: Number, status: String) => {
  const payload = await getPayload({
      config
  });

// Dynamic email content based on status
const contentByStatus = status === "completed" 
  ? `
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
      We are pleased to inform you that your deposit of <strong>$${amount.toFixed(2)}</strong> has been successfully completed.
    </p>
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
      Thank you for trusting us with your transactions! If you have any questions or need further assistance, please don't hesitate to contact our support team.
    </p>
  `
  : `
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
      We regret to inform you that your deposit of <strong>$${amount.toFixed(2)}</strong> has failed.
    </p>
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
      Please check your account details and try again. If the issue persists, feel free to contact our support team for assistance.
    </p>
  `;

  const htmlContent = `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Deposit Status</title>
</head>
<body
style="
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333333;
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
              background-color: ${status === "completed" ? "#4CAF50" : "#FF5722"};
              border-radius: 8px 8px 0 0;
            "
          >
            <h1 style="color: #ffffff; font-size: 28px; margin: 0">
              Deposit ${status.charAt(0).toUpperCase() + status.slice(1)}
            </h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px">
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5">
              Hello ${first_name} ${last_name},
            </p>
            ${contentByStatus}
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
            <p style="margin: 0 0 10px 0; color: #666666">This is an automated message, please do not reply.</p>
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
      to: to,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
