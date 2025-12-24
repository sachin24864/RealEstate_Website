import { z } from "zod";
import { Client } from './abstract';

export class BlogClint extends Client {
    constructor(url: string) {
        super(url);
    }

    async getBlog() {
        try {
            const res = await this.request("GET", "/api/admin/blog");
            return res.data;
        } catch (error) {
            console.error("getBlog error:", error);
            throw error;
        }
    }

    async getBlogById(id: string) {
        try {
            const res = await this.request("GET", `/api/admin/blog/${id}`);
            return res.data;
        } catch (error) {
            console.error("getBlogById error:", error);
            throw error;
        }
    }

    async updateBlog(id: string, data: FormData) {
        try {
            const res = await this.request("PUT", `/api/admin/blog/${id}`, {
                data,
            });
            return res.data;
        } catch (error) {
            console.error("updateBlog error:", error);
            throw error;
        }
    }
    async createBlog(data: FormData) {
        try {
            const res = await this.request("POST", "/api/admin/blog", {
                data,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("createProperty error:", error);
            throw error;
        }
    }
    async deleteBlog(proId: string) {
        try {
            await this.request("DELETE", `/api/admin/blog/${proId}`, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("deletepro error:", error);
            throw error;
        }
    }
}
