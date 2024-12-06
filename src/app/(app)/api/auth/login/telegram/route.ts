import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export async function GET(req: Request) {
    // Get query parameters (authorization code and state) from the URL
    const payload = await getPayloadHMR({
        config,
    })
    const url = new URL(req.url);
    const chatId = url.searchParams.get("id");
    const userId = url.searchParams.get("user_id");
    const firstName = url.searchParams.get("first_name");
    const lastName = url.searchParams.get("last_name");
    const authDate = url.searchParams.get("auth_date");
    const hash = url.searchParams.get("hash");

    const telegram = await payload.create({
        collection: 'telegram',
        data: {
            chat_id: Number(chatId),
            first_name: firstName,
            last_name: lastName,
            auth_date: authDate,
            hash: hash,
        },
    });
    await payload.update({
        collection: 'users',
        id: userId,
        data: { telegram: telegram.id },
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/user-profile"  // Redirect to home or dashboard after successful login
        }
    });
}