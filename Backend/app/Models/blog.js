import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String, 
            required: true,
        },
        // SEO Fields
        slug: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            index: true,
        },
        metaTitle: {
            type: String,
            trim: true,
        },
        metaDescription: {
            type: String,
            trim: true,
        },
        metaKeywords: {
            type: String,
            trim: true,
        },
    },

    { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);