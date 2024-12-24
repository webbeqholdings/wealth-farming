'use server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as nextHeaders } from 'next/headers'

export const getReferralsByParentId = async (
    page: number,
    limit: number
): Promise<{ docs: any; referral_code: string; totalPages: number; totalDocs: number }> => {
    try {
        const payload = await getPayload({
            config,
        });
        const headers = await nextHeaders();
        const auth = await payload.auth({ headers });

        const response = await payload.find({
            collection: 'user-referrals',
            where: {
                parent: { equals: auth.user.id },
            },
            page, // Pass the page number
            limit, // Pass the number of items per page
        });

        const referrals: any = response.docs;
        return {
            docs: referrals.map((referral: any) => ({
                id: referral.id.toString(), // Ensure ID is a string
                name: `${referral.child?.first_name || ''} ${referral.child?.last_name || ''}`.trim(),
                email: referral.child?.email || 'N/A', // Default to 'N/A' if email is missing
                date: referral.referral_at
                    ? new Date(referral.referral_at).toISOString().split('T')[0] // Format date to YYYY-MM-DD
                    : 'N/A',
                status: referral.child?.email_verified ? 'Completed' : 'Pending', // Use email_verified for status
            })),
            referral_code: referrals[0].parent.referral_code,
            totalPages: response.totalPages,
            totalDocs: response.totalDocs,
        };
    } catch (error) {
        console.error('Error fetching referrals by parent ID:', error);

        return { docs: [], referral_code: '', totalPages: 0, totalDocs: 0 };
    }
};
