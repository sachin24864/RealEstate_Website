import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { blogClint } from "../store/index";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const blogSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required"),
    image: z.any().refine((files) => files?.length == 1, "Image is required."),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface AddBlogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd?: (newBlog: any) => void;
}

export function AddBlogDialog({ open, onOpenChange, onAdd }: AddBlogDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
            form.setValue("image", e.target.files);
        }
    };

    const onSubmit = async (data: BlogFormData) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            const response = await blogClint.createBlog(formData);

            toast.success(response.message || "Blog added successfully!");
            if (onAdd && response.blog) onAdd(response.blog);

            form.reset();
            setImagePreview(null);
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to add blog: " + (error.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Blog Post</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new blog post.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Blog Title" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Blog content..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormItem>
                            <FormLabel>Blog Image</FormLabel>
                            <FormControl><Input type="file" accept="image/*" onChange={handleImageChange} /></FormControl>
                            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md mt-2" />}
                            <FormMessage />
                        </FormItem>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Blog"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}