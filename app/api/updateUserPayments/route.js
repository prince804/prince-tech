import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request) {
    revalidateTag("users")
    try {
        await dbConnect();
        const { username, id } = await request.json();
        const user = await User.findOne({ username: username });
        const userPayments = await user.payments;
        const selectedObj = await userPayments.filter(item => item._id == id)
        selectedObj[0].isPaid = true;
        let currentRevenue = 0;
        await userPayments.map((item) => {
            if (!item.isPaid) {
                currentRevenue += item.revenue;
            }
        })
        user.currentRevenue = currentRevenue;
        await user.save();
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: `Error fetching users: ${error.message}` }, { status: 500 });
    }
}