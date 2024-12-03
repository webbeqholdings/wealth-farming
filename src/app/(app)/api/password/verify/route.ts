import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';

export async function POST(req: Request) {
  try {
    const { id, otp } = await req.json(); // Access the request body to get `id` and `otp`

    const payload = await getPayloadHMR({ config });

    // Find user based on id and otp
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: { equals: id },
        otp: { equals: otp },
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found with the given id and OTP
      return NextResponse.json(
        { error: 'OTP is invalid or user not found' },
        { status: 404 }
      );
    }

    const user = userQuery.docs[0];

    const currentTime = new Date();
    const otpExpiresAt = new Date(user.otp_expires_at);
    const timeRemaining = currentTime.getTime() - otpExpiresAt.getTime();

    // Check if OTP has expired (2 minutes expiry time)
    if (timeRemaining >= 2 * 60 * 1000) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Update the user data after OTP verification
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        otp: null,           // Clear the OTP
        otp_expires_at: null, // Clear OTP expiration time
      },
    });

    return NextResponse.json({
      user: updatedUser,
      response: 'OTP successfully verified and user updated',
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error },
      { status: 500 }
    );
  }
}
