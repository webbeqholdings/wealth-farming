import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { authenticator } from 'otplib';
import { sendEmail } from '@/utilities/emailSender';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();  // Get 'id' from the request body
    const payload = await getPayloadHMR({ config });

    // Find the user by ID
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: { equals: id }, // Filter where 'id' matches
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user with new OTP
    const updatedUser = await payload.update({
      collection: 'users',
      id: userQuery.docs[0].id,
      data: {
        otp: authenticator.generate(process.env.OTP_SECRET),
        otp_expires_at: new Date().toISOString(),
      },
    });

    // Send the OTP to the user's email
    try {
      await sendEmail(updatedUser.email, 'Your OTP Code', updatedUser.otp);
    } catch (error) {
      console.error('Error sending email:', error);
    }

    // Return response with success
    return NextResponse.json({
      user: updatedUser,
      response: 'Successfully updated OTP',
    });

  } catch (error) {
    console.error('Error during OTP resend:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
