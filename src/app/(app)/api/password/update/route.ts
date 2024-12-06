import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();  // Extract the id and password from the request body

    const payload = await getPayloadHMR({ config });

    // Find the user by ID
    const userQuery = await payload.find({
      collection: 'users',
      where: {
        id: { equals: id },  // Filter by user ID
      },
    });

    if (userQuery.docs.length === 0) {
      // No user found
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user's password
    const updatedUser = await payload.update({
      collection: 'users',
      id: userQuery.docs[0].id,
      data: {
        password,  // Update the password
      },
    });

    // Return success response
    return NextResponse.json({
      user: updatedUser,
      response: 'Password successfully updated',
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
