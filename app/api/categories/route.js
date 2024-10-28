import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const getCategories = async () => {
    const response = await fetch('https://ketosl.com/wp-json/wp/v2/categories?per_page=100&_fields=id,name');
    const data = await response.json();
    return data;
}

const getPosts = async (categoryId) => {
    let fetchedPosts = [];
    let page = 1;
    let totalPages = 1;

    do {
        const response = await fetch(`https://ketosl.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=100&page=${page}&_fields=title,link`);
        const data = await response.json();

        // Map the fetched posts from the current page
        const postsFromPage = data.map(post => ({
            title: post.title.rendered,
            link: post.link
        }));

        // Add the current page posts to the fetchedPosts array
        fetchedPosts = fetchedPosts.concat(postsFromPage);

        // Get the total number of pages from the headers
        totalPages = response.headers.get('X-WP-TotalPages');
        page++;
    } while (page <= totalPages);

    return fetchedPosts;
}

export async function POST() {
    revalidateTag("categories");
    try {
        await dbConnect();
        const Categories = await getCategories();
        
        const bulkOps = await Promise.all(
            Categories.map(async (category) => {
                const posts = await getPosts(category.id); // Fetch posts for each category

                return {
                    updateOne: {
                        filter: { categoryId: category.id },
                        update: {
                            $setOnInsert: { // Only set these fields if the document is new
                                categoryId: category.id,
                                name: category.name,
                                posts: posts
                            }
                        },
                        upsert: true // Insert if not found
                    }
                };
            })
        );

        await Category.bulkWrite(bulkOps); // Perform the bulk write operation
        const newCategoryIds = Categories.map(category => category.id);
        await Category.deleteMany({ categoryId: { $nin: newCategoryIds } });
        
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