import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const getCategories = async () => {
    const response = await fetch('https://ketosl.com/wp-json/wp/v2/categories?per_page=100&_fields=id,name');
    const data = await response.json();
    return data;
}

export async function POST() {
    revalidateTag("categories");
    try {
        await dbConnect();
        const Categories = await getCategories();
        
        const bulkOps = Categories.map(category => ({
            updateOne: {
                filter: { categoryId: category.id },
                update: { categoryId: category.id, name: category.name, posts: [] },
                upsert: true // This will insert if not found
            }
        }));

        await Category.bulkWrite(bulkOps); // Perform the bulk write operation
        return NextResponse.json({ message: `All Categories are Updated in Data Base` });
    } catch (error) {
        return NextResponse.json({ message: `Error Updating Categories: ${error.message}` });
    }

}

// GET API to fetch categories and posts
export async function GET() {
    revalidateTag("categories");
    try {
        await dbConnect();
        const categories = await Category.find(); // Fetch all categories with their posts

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}