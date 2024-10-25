import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Get the base URL of your site
        const { protocol, host } = req.nextUrl; // This gives the full URL components
        const baseUrl = `${protocol}//${host}`; // Construct the base URL

        // Create a response object and redirect using absolute URL
        const response = NextResponse.redirect(`${baseUrl}/admin`); // Absolute URL for redirection

        // Clear the token cookie by setting it with an expired date
        response.cookies.set('admintoken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure secure flag is true in production
            sameSite: 'strict',
            path: '/', // Ensure the cookie is removed from the entire application
            expires: new Date(0), // Set the cookie to expire immediately
        });

        return response;
    } catch (error) {
        console.error('Error in logout API:', error);
        return NextResponse.error(); // Return a 500 error response
    }
}
