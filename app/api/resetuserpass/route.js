import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {

        const { oldUsername, oldPassword, confirmPassword, newPassword } = await request.json();
        await dbConnect();

        const user = await User.findOne({ username: oldUsername });
        if (!user) {
            return NextResponse.json({ message: 'Invalid username or password!' }, { status: 401 });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid username or password!' }, { status: 401 });
        }
        if (newPassword != confirmPassword) {
            return NextResponse.json({ message: 'New Password and Confirm Password Fields Are Not Same!' }, { status: 401 });
        }

        if (user && isMatch && newPassword === confirmPassword) {
            user.password = bcrypt.hashSync(newPassword, 10);
            // const newuser = new User({ username: newUsername, password: bcrypt.hashSync(newPassword, 10) })
            await user.save()
        }
        return NextResponse.json({ message: "Credentials Reset Successfully" })
    } catch (error) {
        return NextResponse.json({ message: "Something Went Wrong!" }, { status: 500 })
    }
}