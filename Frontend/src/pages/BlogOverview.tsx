import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Spin, message } from "antd";
import { blogClint } from "@/store";
import SEO from "@/components/SEO";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BlogItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
}

export default function BlogOverview() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await blogClint.getBlogBySlug(slug);
        const b: BlogItem | undefined = res.blog;
        if (!b) {
          setBlog(null);
          return;
        }
        setBlog(b);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        message.error("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const imgSrc =
    blog?.image && (blog.image.startsWith("http") ? blog.image : `${BACKEND_URL}${blog.image}`);

  return (
    <>
      {blog && (
        <SEO
          title={blog.metaTitle || blog.title}
          description={blog.metaDescription || (blog.description || "").substring(0, 160)}
          url={`https://naveenassociatesgroup.com/blog/${blog.slug || blog._id}`}
          canonical={`https://naveenassociatesgroup.com/blog/${blog.slug || blog._id}`}
          image={imgSrc}
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "image": imgSrc,
            "datePublished": blog.createdAt,
            "description": blog.description
          }}
        />
      )}
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
            </div>
          ) : blog ? (
            <article className="bg-white rounded-md overflow-hidden shadow">
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                <p className="text-sm text-gray-500 mb-6">{new Date(blog.createdAt).toLocaleString()}</p>
                <div
                  className="prose max-w-none text-gray-800 [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>
            </article>
          ) : (
            <div className="text-center py-20">Blog not found</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}