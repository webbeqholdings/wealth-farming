import { google } from "@/lib/auth"; // Import your google auth helper module
import { cookies } from "next/headers";
import axios from "axios"; // You'll need axios to send HTTP requests
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import crypto from "crypto";

function generateRandomPassword() {
    return crypto.randomBytes(16).toString("hex"); // 16-byte random password
}

export async function GET(req: Request) {
    // Get query parameters (authorization code and state) from the URL
    const payload = await getPayloadHMR({
        config,
    })
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
        return new Response("Invalid request", { status: 400 });
    }
    // Retrieve the state and code_verifier from cookies to verify the state and code
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state").value;
    const storedCodeVerifier = cookieStore.get("google_code_verifier").value;

    // Check if the state matches
    if (storedState !== state) {
        return new Response("State mismatch", { status: 400 });
    }

    // Exchange the authorization code for an access token
    try {
        const tokenResponse = await axios.post(
            'https://oauth2.googleapis.com/token',
            new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
                client_secret: process.env.GOOGLE_CLIENT_SECRET,  // Your Google Client Secret
                redirect_uri: `${process.env.BASE_URL}/api/auth/login/google/callback`, // Redirect URI in your Google developer console
                grant_type: 'authorization_code',
                code_verifier: storedCodeVerifier, // Use the same code verifier
            })
        );

        const { access_token, id_token, expires_in } = tokenResponse.data;

        // Here, you can store the tokens and user information (id_token) in your session or database

        // For example, set a cookie or a session for the user
        cookieStore.set("google_access_token", access_token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expires_in,  // Token expiry time
            sameSite: "lax"
        });

        const googleRes = await fetch(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                method: "GET",
            }
        )

        const googleData = await googleRes.json()
        if (googleRes.ok) {
            const randomPassword = generateRandomPassword(); // Generate random password
            const userByEmail = await payload.find({
                collection: 'users',
                where: {
                    email: {
                        equals: googleData.id + '@gmail.com',
                    },
                },
            });
            const user = userByEmail.docs[0];
            if (!user) {
                const userCreate = await payload.create({
                    collection: 'users',
                    data: {
                        email: googleData.id + '@gmail.com',
                        password: randomPassword,
                        first_name: googleData.given_name,
                        last_name: googleData.family_name,
                        role: 'individual',
                        email_verified: true
                    },
                });
                const accountTypes = ['Main Account', 'Saving Account', 'Investment Account'];
                //Create accounts associated with this user
                await Promise.all(accountTypes.map(type =>
                  payload.create({
                    collection: 'accounts',
                    data: {
                      user: userCreate.id,
                      account_name: type,
                      account_number: Math.floor(Math.random() * 1000000),
                      amount: 0
                    }
                  })
                ));
            } else {
                await payload.update({
                    collection: 'users',
                    id: user.id,
                    data: {
                        password: randomPassword
                    },
                });
            }
            // Log in the user after successful registration
            const loginResult = await payload.login({
                collection: 'users',
                data: {
                    email: googleData.id + '@gmail.com',
                    password: randomPassword,
                },
            })
            if (loginResult.token) {
                cookieStore.set("payload-token", loginResult.token, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                });
                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: "/"  // Redirect to home or dashboard after successful login
                    }
                });
              }
        } else {
            return new Response("Invalid request", { status: 400 });
        }

    } catch (error) {
        return new Response("Error during login", { status: 500 });
    }
}