import { NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
    const { username, password } = await request.json();

    // Connect to the database
    await dbConnect();
    // const admin = new Admin({ username: "admin", password: bcrypt.hashSync("password", 10) })
    // admin.save()
    // Find the user in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    if (admin) {
        // Create a JWT admintoken
        const admintoken = jwt.sign(
            { userId: admin._id, username: admin.username },
            process.env.JWT_SECRET
            // { expiresIn: '1h' }
        );
        const response = NextResponse.json({ username: username, message: 'Login successful' });
        response.cookies.set('admintoken', admintoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure cookie is secure in production
            sameSite: 'strict', // Prevent CSRF attacks
            path: '/', // Cookie is available throughout the app
        });
        return response;
    }
    // Return the admintoken as a response
    return NextResponse.json({ admintoken });
}
