import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
    const token = req.cookies.get('token')?.value;
    const adminToken = req.cookies.get('admintoken')?.value;
    const url = req.nextUrl.clone();

    // --- Admin Page and Admin Panel Handling ---
    if (url.pathname.startsWith('/admin')) {
        // Admin login page should be accessible even if a user token is present
        if (url.pathname === '/admin' && !adminToken) {
            // Allow access to the admin login page if no admin token is present
            return NextResponse.next();
        }

        if (adminToken) {
            try {
                // Verify the admin token
                const { payload } = await jwtVerify(adminToken, secret);
                // If accessing /admin, redirect to /admin/adminpanel
                if (url.pathname === '/admin') {
                    url.pathname = '/admin/adminpanel';
                    return NextResponse.redirect(url);
                }
                // Allow access to admin subpages
                return NextResponse.next();
            } catch (err) {
                // Invalid admin token, redirect to /admin login
                url.pathname = '/admin';
                return NextResponse.redirect(url);
            }
        } else {
            // No admin token, ensure we're on the /admin login page and not accessing admin panel
            if (url.pathname !== '/admin') {
                url.pathname = '/admin';
                return NextResponse.redirect(url);
            }
        }
    }

    // --- User Login and Dashboard Handling ---
    if (url.pathname === '/login' && token) {
        try {
            // Verify the user token
            const { payload } = await jwtVerify(token, secret);
            const username = payload.username;

            // Redirect logged-in users to their dashboard
            url.pathname = `/dashboard/${username}`;
            const response = NextResponse.redirect(url);

            // Set username in a cookie for convenience
            response.cookies.set('username', username, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return response;
        } catch (err) {
            // If token verification fails, allow user to stay on /login
            return NextResponse.next();
        }
    }

    // --- Handle /dashboard Access ---
    if (url.pathname === '/dashboard') {
        if (!token) {
            // Redirect to /login if no user token is present
            return NextResponse.redirect(new URL('/login', req.url));
        } else {
            try {
                // Verify the user token
                const { payload } = await jwtVerify(token, secret);
                const username = payload.username;

                // Redirect to /dashboard/[username]
                url.pathname = `/dashboard/${username}`;
                return NextResponse.redirect(url);
            } catch (err) {
                // If token verification fails, redirect to /login
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }
    }

    // Redirect unauthenticated users trying to access /dashboard subpaths to /login
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Handle user dashboard subpage access
    if (token) {
        try {
            // Verify the user token
            const { payload } = await jwtVerify(token, secret);
            const username = payload.username;

            const response = NextResponse.next();
            // Set username in a cookie for convenience
            response.cookies.set('username', username, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            // Handle redirection logic to the correct dashboard or subpage
            if (url.pathname === `/dashboard/${username}` || url.pathname.startsWith(`/dashboard/${username}`)) {
                return response;
            } else {
                // Redirect to user's dashboard if accessing an incorrect path
                url.pathname = `/dashboard/${username}`;
                return NextResponse.redirect(url);
            }
        } catch (err) {
            // If token verification fails, redirect to /login
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // Default: Allow the request to continue if no specific conditions are met
    return NextResponse.next();
}

// --- Configure the paths for which this middleware should apply ---
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/admin/:path*',
        '/dashboard',
    ],
};
