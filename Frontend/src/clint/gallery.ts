import { Client } from './abstract';

export class GalleryClient extends Client {
    constructor(url: string) {
        super(url);
    }

    async uploadImage(formData: FormData) {
        try {
            const res = await this.request("POST", "/api/admin/gallery", {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("uploadImage error:", error);
            throw error;
        }
    }

    async getImages(category?: string) {
        try {
            const url = category ? `/api/admin/gallery?category=${encodeURIComponent(category)}` : '/api/admin/gallery';
            const res = await this.request("GET", url);
            return res.data;
        } catch (error) {
            console.error("getImages error:", error);
            throw error;
        }
    }

    async deleteImage(imageId: string) {
        try {
            const res = await this.request("DELETE", `/api/admin/gallery/${imageId}`, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("deleteImage error:", error);
            throw error;
        }
    }

    async updateImage(imageId: string, data: Partial<{ title: string; description: string; category: string }>) {
        try {
            const res = await this.request("PUT", `/api/admin/gallery/${imageId}`, {
                data,
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("updateImage error:", error);
            throw error;
        }
    }
}