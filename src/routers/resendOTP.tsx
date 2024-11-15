import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { authenticator } from 'otplib';
import { sendEmail } from '@/utilities/emailSender';

const resendOTP = async (req) => {
    try {
        const request = await req.json();
        const payload = await getPayloadHMR({
            config,
        });

        const userQuery = await payload.find({
            collection: 'users',
            where: {
                id: {
                    equals: request.id, // Filter where OTP is null
                },
            },
        });

        if (userQuery.docs.length === 0) {
            // No user found with the given token
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
            id: request.id,
            data: {
                otp: authenticator.generate(process.env.OTP_SECRET),
                otp_expires_at: new Date()
            },
        });

        try {
            await sendEmail(updatedUser.email, 'Your OTP Code', updatedUser.otp);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }

        return new Response(
            JSON.stringify({
                user: updatedUser,
                response: 'successfully updated otp',
            })
        );
    } catch (error) {
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
    path: '/resend-otp',
    method: 'post' as const,
    handler: resendOTP,
};
