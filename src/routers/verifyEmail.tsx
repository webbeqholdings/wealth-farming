import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';

const verifyEmail = async (req = {query: {}}) => {
  try {
    const request = req.query;
    const payload = await getPayloadHMR({
      config,
    });
    
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: request.id
        },
        verification_token: {
          equals: request.token, // Compare with request token
        },
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found with the given token
      return new Response(
        JSON.stringify({
          response: 'Invalid or expired token',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
   
    const updatedUser = await payload.update({
      collection: 'users',
      id: request.id,
      data: {
        verification_token: null,
        email_verified: true,
      },
    });

    return new Response(
      JSON.stringify({
        user: updatedUser,
        response: 'successfully updated tracking info',
      }),
      {
        status: 302,
        headers: {
          'Location': 'http://localhost:3000/join', // Redirection URL
        },
      }
    );
  } catch (error) {
    console.error('Verification error:', error);

    const errorBody = { error: 'Internal server error' };
    return new Response(
      JSON.stringify({
        response: errorBody,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export default {
  path: '/verify-email',
  method: 'get' as const,
  handler: verifyEmail,
};
