import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

  // Directly modify cookies using Set-Cookie header
  const headers = new Headers();

  // Set the cookies using the 'Set-Cookie' header
  headers.append('Set-Cookie', `google_oauth_state=${state}; Path=/; HttpOnly; Max-Age=600; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`);
  headers.append('Set-Cookie', `google_code_verifier=${codeVerifier}; Path=/; HttpOnly; Max-Age=600; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`);

  return new Response(null, {
    status: 302,
    headers: {
      ...Object.fromEntries(headers.entries()), // Convert Headers to object to include in Response
      Location: url.toString(), // Set the redirect location
    },
  });
}
