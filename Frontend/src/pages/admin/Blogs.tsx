import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AddBlogDialog } from "@/components/AddBlogDialog";
import { blogClint } from "@/store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Blog {
    _id: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
}

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const data = await blogClint.getBlog();
                setBlogs(data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                toast.error("Failed to load blogs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleAddBlog = (newBlog: Blog) => {
        setBlogs((prev) => [newBlog, ...prev]);
    };

    const handleDeleteBlog = async () => {
        if (!blogToDelete) return;

        try {
            await blogClint.deleteBlog(blogToDelete);
            setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete));
            toast.success("Blog post deleted successfully.");
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog post.");
        } finally {
            setBlogToDelete(null);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Blogs</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Blog
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                            ) : blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <TableRow key={blog._id}>
                                        <TableCell>
                                            <img src={`${BACKEND_URL}${blog.image}`} alt={blog.title} className="h-12 w-16 object-contain bg-gray-200 rounded-md" />
                                        </TableCell>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => setBlogToDelete(blog._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center">No blog posts found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddBlogDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddBlog} />

            <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this blog post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBlog} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Blogs;