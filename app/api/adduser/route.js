import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request) {
    // Get the origin (base URL) from the incoming request headers
    const { headers } = await request;
    const origin = await headers.get('origin');

    const { username, password, commission } = await request.json();
    // Connect to the database
    await dbConnect();

    const checkUser = await User.findOne({ username: username });
    if (checkUser) {
        return NextResponse.json({ error: `User Already Exist` }, { status: 401 })
    }

    else {
        const response = await fetch(`${origin}/api/updatePayments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        }).catch((error) => console.error('Error fetching data:', error));
        const payments = await response.json();
        for (const object of payments) {
            if (!("isPaid" in object)) {
                object["isPaid"] = false;
            }
        }
        const currentRevenue = payments.reduce((total, item) =>total + Number(item.revenue), 0);
        const user = new User(
            {
                username: username,
                password: bcrypt.hashSync(password, 10),
                commission: commission,
                currentRevenue: currentRevenue,
                payments: payments
            }
        )
        await user.save()
        return NextResponse.json({ message: `User ${username} Added Successfully` });
    }

}