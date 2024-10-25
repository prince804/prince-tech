import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: String,
    link: String,
});

const categorySchema = new mongoose.Schema({
    categoryId: Number,
    name: String,
    posts: [postSchema], // Array of post objects containing title and link
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
