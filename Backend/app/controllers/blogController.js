import Blog from '../Models/blog.js';

export const createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required.' });
        }

        const imageUrl = `/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;

        const newBlog = new Blog({
            title,
            description,
            image: imageUrl,
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error while creating blog.' });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ blogs });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching blogs.' });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        // Optional: You can add logic here to delete the image file from the server.
        res.status(200).json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting blog.' });
    }
};