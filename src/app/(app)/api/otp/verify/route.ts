import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';

export async function POST(req: Request) {
  try {
    const { id, otp } = await req.json(); // Extract the id and otp from the request body

    const payload = await getPayloadHMR({ config });

    // Find the user with the provided ID and OTP
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: { equals: id },
        otp: { equals: otp },
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found with the given ID and OTP
      return NextResponse.json(
        { error: 'User not found or invalid OTP' },
        { status: 404 }
      );
    }

    const user = userQuery.docs[0];
    const currentTime = new Date();
    const otpExpiresAt = new Date(user.otp_expires_at);
    const timeRemaining = currentTime.getTime() - otpExpiresAt.getTime();

    // Check if OTP has expired
    if (timeRemaining >= 2 * 60 * 1000) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Update user after OTP verification
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        email_verified: true,
        otp: null,
        otp_expires_at: null,
      },
    });

    const accountName = ['Main', 'Referral Reward', 'Investment'] as const;
    const accountTypes: ['main', 'referral_reward', 'investment'] = ['main', 'referral_reward', 'investment'];

    // Create accounts associated with the user
    await Promise.all(accountTypes.map((type, index) =>
      payload.create({
        collection: 'accounts',
        data: {
          user: user.id,
          account_name: accountName[index],
          account_number: Math.floor(Math.random() * 1000000),
          amount: 0,
          type: type,
        }
      })
    ));

    // Return a successful response
    return NextResponse.json({
      user: updatedUser,
      response: 'OTP successfully verified and user updated',
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
