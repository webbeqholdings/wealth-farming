import { getPayload } from 'payload'
import config from '@payload-config';
import { PayloadRequest } from 'payload';

const updatePasword = async (req: PayloadRequest) => {
  try {
    const payload = await getPayload({
      config,
    });
    // Access request body data
    const request = await req.json();
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: request.id, // Compare with request ID from body
        }
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found with the given ID
      return new Response(
        JSON.stringify({
          response: 'User not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
   
    const updatedUser = await payload.update({
      collection: 'users',
      id: userQuery.docs[0].id,
      data: {
        password: request.password,
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
  path: '/update-password',
  method: 'post' as const,
  handler: updatePasword,
};
