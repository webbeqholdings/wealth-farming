'use server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function getReferralsByParentId(parentId: number) {
    const payload = await getPayload({
        config,
    });

    try {
        const response = await payload.find({
            collection: 'user-referrals',
            where: {
                parent: { equals: parentId },
            },
        });

        if (response.docs.length > 0) {
            return response.docs;
        }

        throw new Error('Failed to fetch referrals');
    } catch (error) {
        console.error('Error fetching referrals by parent ID:', error);
        throw new Error('Failed to fetch referrals');
    }
}