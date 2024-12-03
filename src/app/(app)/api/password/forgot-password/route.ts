import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { authenticator } from 'otplib';
import { sendEmail } from '@/utilities/emailSender';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    const payload = await getPayloadHMR({ config });
    
    // Find the user with the provided email
    const userQuery = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    });
    
    if (userQuery.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate OTP and update the user
    const updatedUser = await payload.update({
      collection: 'users',
      id: userQuery.docs[0].id,
      data: {
        otp: authenticator.generate(process.env.OTP_SECRET),
        otp_expires_at: new Date().toISOString(),
      },
    });

    // Send the OTP via email
    try {
      await sendEmail(updatedUser.email, 'Your OTP Code', updatedUser.otp);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }

    // Return success response
    return NextResponse.json({
      user: updatedUser,
      response: 'OTP successfully updated and email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
