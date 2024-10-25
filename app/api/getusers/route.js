import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
    revalidateTag("users")
    try {
        await dbConnect();
        const users = await User.find({}).lean();

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'No Users Found' }, { status: 401 });
        }

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: `Error fetching users: ${error.message}` }, { status: 500 });
    }
}
