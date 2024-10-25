import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const getCategories = async () => {
    const response = await fetch('https://fashiontipstricks.com/wp-json/wp/v2/categories&_fields=id,name');
    const data = await response.json();
    return data;
}

export async function POST() {
    revalidateTag("categories");
    try {
        await dbConnect();
        const Categories = await getCategories();
        for (const category of Categories) {

            // Check if the category already exists in the database
            const existingCategory = await Category.findOne({ categoryId: category.id });

            if (!existingCategory) {
                // Create new category
                const newCategory = new Category({
                    categoryId: category.id,
                    name: category.name,
                    posts: [],
                });
                await newCategory.save();
            }
        }
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