import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { PayloadRequest } from 'payload';

const verifyPasword = async (req: PayloadRequest) => {
  try {
    const payload = await getPayloadHMR({
      config,
    });
    // Access request body data
    const request = await req.json();
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: request.id, // Compare with request ID from body
        },
        otp: {
          equals: request.otp
        }
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found with the given ID
      return new Response(
        JSON.stringify({
          response: 'Otp is invalid',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const user = userQuery.docs[0];

    const currentTime = new Date();
    const otpExpiresAt = new Date(user.otp_expires_at);
    const timeRemaining =  currentTime.getTime() - otpExpiresAt.getTime();

    if (timeRemaining >= 2 * 60 * 1000) {
      throw new Error('OTP has expired');
    }
   
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        otp: null,
        otp_expires_at: null,
      },
    });
    return new Response(
      JSON.stringify({
        user: updatedUser,
        response: 'OTP successfully verified and user updated',
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        response: 'Internal server error',
        error: error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export default {
  path: '/verify-password',
  method: 'post' as const,
  handler: verifyPasword,
};
