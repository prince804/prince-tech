import { NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Connect to the database
        await dbConnect();

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }
        if (user) {
            // Create a JWT token
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET
                // { expiresIn: '1h' }
            );
            const response = NextResponse.json({ username: username, message: 'Login successful' });
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Ensure cookie is secure in production
                sameSite: 'strict', // Prevent CSRF attacks
                path: '/', // Cookie is available throughout the app
            });
            return response;
        }
        // Return the token as a response
        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
