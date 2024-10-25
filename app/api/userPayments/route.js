import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request) {
    revalidateTag("users")
    try {
        await dbConnect();
        const { username } = await request.json();
        const user = await User.findOne({ username: username }).lean();
        return NextResponse.json(user);

    } catch (error) {
        return NextResponse.json({ error: `Error fetching users: ${error.message}` }, { status: 500 });
    }
}
