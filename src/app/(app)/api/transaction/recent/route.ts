import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { NextRequest } from 'next/server';  // Import NextRequest from 'next/server'

export async function GET(req: NextRequest) {  // Type the req parameter as NextRequest
  try {
    const url = new URL(req.url);  // req.url contains the full URL
    const user_id = url.searchParams.get('user_id');   // Extract the user_id from the query string

    // Initialize Payload CMS with the config
    const payload = await getPayloadHMR({ config });

    // Define transaction types to filter by
    const types = ['deposit', 'withdraw', 'transfer', 'investment'];
    let transactions = [];

    // Fetch the most recent transaction for each type
    for (let type of types) {
      const result = await payload.find({
        collection: 'transactions',
        where: {
          user: { equals: user_id }, // Filter by user ID
          type: { equals: type },     // Filter by transaction type
        },
        sort: '-createdAt',  // Sort by createdAt (most recent first)
        limit: 1,            // Limit to the most recent transaction per type
      });

      // If a transaction is found, add it to the list
      if (result && result.docs.length > 0) {
        transactions.push(result.docs[0]); // Add the most recent transaction
      }
    }

    // Optionally, sort the transactions by createdAt in descending order
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Limit the results to 4 (although it should already be limited to 4)
    transactions = transactions.slice(0, 4);

    // Return the response with the transaction data
    return NextResponse.json({
      data: transactions,
      response: 'Successfully fetched recent transactions',
    });
    
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
