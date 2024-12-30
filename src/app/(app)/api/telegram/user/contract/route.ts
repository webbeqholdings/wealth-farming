import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { NextRequest } from 'next/server';  // Import NextRequest from 'next/server'

export async function GET(req: NextRequest) {  // Type the req parameter as NextRequest
  try {
    const url = new URL(req.url);  // req.url contains the full URL
    const chat_id = url.searchParams.get('chat_id');   // Extract the user_id from the query string

    // Initialize Payload CMS with the config
    const payload = await getPayloadHMR({ config });

    const telegram = await payload.find({
        collection: 'telegram',
        where: {
          chat_id: { equals: chat_id }
        },
    });
    const user = await payload.find({
        collection: 'users',
        where: {
            telegram: {equals: Number(telegram.docs[0].id)}
        }
    })

    const contracts = await payload.find({
        collection: 'contracts',
        where: {
            user: {equals: Number(user.docs[0].id)}
        }
    })

    // Return the response with the transaction data
    return NextResponse.json({
      contract: contracts.docs,
      response: 'Successfully fetched contracts',
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
